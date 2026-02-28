import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface WhatsAppRequest {
  booking_type: 'labor' | 'equipment';
  booking_id: string;
  booker_phone: string;
  booker_name?: string;
  owner_user_id: string;
  item_name: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  location?: string;
  workers?: number;
}

async function sendWhatsAppMessage(to: string, body: string) {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio credentials not configured');
  }

  // Format phone numbers for WhatsApp
  const formattedTo = to.startsWith('+') ? to : `+91${to.replace(/\D/g, '')}`;
  const whatsappTo = `whatsapp:${formattedTo}`;
  const whatsappFrom = `whatsapp:${fromNumber}`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const params = new URLSearchParams();
  params.append('To', whatsappTo);
  params.append('From', whatsappFrom);
  params.append('Body', body);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const result = await response.json();

  if (!response.ok) {
    console.error('Twilio error:', result);
    throw new Error(result.message || 'Failed to send WhatsApp message');
  }

  return result;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: WhatsAppRequest = await req.json();
    const {
      booking_type,
      booker_phone,
      booker_name,
      owner_user_id,
      item_name,
      start_date,
      end_date,
      total_amount,
      location,
      workers,
    } = data;

    // Fetch owner's phone from profiles
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: ownerProfile } = await supabase
      .from('profiles')
      .select('phone, full_name')
      .eq('user_id', owner_user_id)
      .single();

    const ownerPhone = ownerProfile?.phone;
    const ownerName = ownerProfile?.full_name || 'Owner';
    const customerName = booker_name || 'A farmer';

    const typeLabel = booking_type === 'labor' ? 'Labor Group' : 'Equipment';
    const dateRange = `${formatDate(start_date)} to ${formatDate(end_date)}`;

    // Message to the booker (customer)
    const bookerMessage = `🌾 *KrishiConnect Booking Confirmed!*

Your ${typeLabel} booking has been submitted.

📋 *${item_name}*
📅 ${dateRange}${workers ? `\n👥 Workers: ${workers}` : ''}${location ? `\n📍 ${location}` : ''}
💰 Total: ₹${total_amount.toLocaleString('en-IN')}

Status: ⏳ Pending Approval
You'll be notified once the ${booking_type === 'labor' ? 'group leader' : 'owner'} responds.`;

    // Message to the owner/leader
    const ownerMessage = `🔔 *New ${typeLabel} Booking Request!*

*${customerName}* wants to book your ${typeLabel.toLowerCase()}.

📋 *${item_name}*
📅 ${dateRange}${workers ? `\n👥 Workers: ${workers}` : ''}${location ? `\n📍 ${location}` : ''}
📞 Contact: ${booker_phone}
💰 Amount: ₹${total_amount.toLocaleString('en-IN')}

Please open KrishiConnect → My Bookings to accept or decline.`;

    const results = { booker: null as any, owner: null as any, errors: [] as string[] };

    // Send to booker
    if (booker_phone) {
      try {
        results.booker = await sendWhatsAppMessage(booker_phone, bookerMessage);
        console.log('WhatsApp sent to booker:', booker_phone);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error('Failed to send to booker:', msg);
        results.errors.push(`Booker: ${msg}`);
      }
    }

    // Send to owner
    if (ownerPhone) {
      try {
        results.owner = await sendWhatsAppMessage(ownerPhone, ownerMessage);
        console.log('WhatsApp sent to owner:', ownerPhone);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error('Failed to send to owner:', msg);
        results.errors.push(`Owner: ${msg}`);
      }
    } else {
      console.warn('Owner phone not found for user:', owner_user_id);
      results.errors.push('Owner phone number not found in profile');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'WhatsApp alerts processed',
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('WhatsApp alert error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
