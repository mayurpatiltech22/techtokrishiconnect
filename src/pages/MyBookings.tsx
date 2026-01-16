import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Calendar, MapPin, Phone, Users, Loader2, IndianRupee, Tractor, CheckCircle, XCircle, Clock, Package, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface LaborBooking {
  id: string;
  start_date: string;
  end_date: string;
  total_workers: number;
  total_amount: number;
  status: string;
  work_description: string;
  farmer_phone: string;
  location: string;
  created_at: string;
  labor_group_id: string;
  farmer_id: string;
  labor_group?: {
    name: string;
    district: string;
  };
  farmer_profile?: {
    full_name: string;
  };
}

interface EquipmentBooking {
  id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: string;
  renter_phone: string;
  delivery_address: string;
  notes: string;
  created_at: string;
  equipment_id: string;
  renter_id: string;
  equipment?: {
    name: string;
    location: string;
  };
  renter_profile?: {
    full_name: string;
  };
}

interface MyEquipment {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price_per_day: number;
  location: string | null;
  district: string | null;
  is_available: boolean;
  category: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-green-500',
  completed: 'bg-blue-500',
  cancelled: 'bg-red-500'
};

export default function MyBookings() {
  const [myLaborBookings, setMyLaborBookings] = useState<LaborBooking[]>([]);
  const [incomingLaborRequests, setIncomingLaborRequests] = useState<LaborBooking[]>([]);
  const [myEquipmentBookings, setMyEquipmentBookings] = useState<EquipmentBooking[]>([]);
  const [incomingEquipmentRequests, setIncomingEquipmentRequests] = useState<EquipmentBooking[]>([]);
  const [myListedEquipment, setMyListedEquipment] = useState<MyEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchAllBookings();
  }, [user]);

  const fetchAllBookings = async () => {
    if (!user) return;
    setLoading(true);

    // Fetch my labor bookings (as farmer)
    const { data: laborBookings } = await supabase
      .from('labor_bookings')
      .select('*')
      .eq('farmer_id', user.id)
      .order('created_at', { ascending: false });

    // Fetch labor group names for my bookings
    if (laborBookings && laborBookings.length > 0) {
      const groupIds = [...new Set(laborBookings.map(b => b.labor_group_id))];
      const { data: groups } = await supabase
        .from('labor_groups')
        .select('id, name, district')
        .in('id', groupIds);
      
      const groupMap = new Map(groups?.map(g => [g.id, g]) || []);
      setMyLaborBookings(laborBookings.map(b => ({
        ...b,
        labor_group: groupMap.get(b.labor_group_id)
      })));
    } else {
      setMyLaborBookings([]);
    }

    // Fetch my labor groups to get incoming requests
    const { data: myGroups } = await supabase
      .from('labor_groups')
      .select('id, name, district')
      .eq('leader_id', user.id);

    if (myGroups && myGroups.length > 0) {
      const groupIds = myGroups.map(g => g.id);
      const { data: incomingBookings } = await supabase
        .from('labor_bookings')
        .select('*')
        .in('labor_group_id', groupIds)
        .order('created_at', { ascending: false });

      if (incomingBookings && incomingBookings.length > 0) {
        // Fetch farmer profiles
        const farmerIds = [...new Set(incomingBookings.map(b => b.farmer_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', farmerIds);
        
        const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
        const groupMap = new Map(myGroups.map(g => [g.id, g]));
        
        setIncomingLaborRequests(incomingBookings.map(b => ({
          ...b,
          labor_group: groupMap.get(b.labor_group_id),
          farmer_profile: profileMap.get(b.farmer_id)
        })));
      } else {
        setIncomingLaborRequests([]);
      }
    }

    // Fetch my equipment bookings (as renter)
    const { data: equipBookings } = await supabase
      .from('equipment_bookings')
      .select('*')
      .eq('renter_id', user.id)
      .order('created_at', { ascending: false });

    if (equipBookings && equipBookings.length > 0) {
      const equipIds = [...new Set(equipBookings.map(b => b.equipment_id))];
      const { data: equipment } = await supabase
        .from('equipment')
        .select('id, name, location')
        .in('id', equipIds);
      
      const equipMap = new Map(equipment?.map(e => [e.id, e]) || []);
      setMyEquipmentBookings(equipBookings.map(b => ({
        ...b,
        equipment: equipMap.get(b.equipment_id)
      })));
    } else {
      setMyEquipmentBookings([]);
    }

    // Fetch my equipment to get incoming rental requests
    const { data: myEquipment } = await supabase
      .from('equipment')
      .select('id, name, location, description, image_url, price_per_day, district, is_available, category, created_at')
      .eq('owner_id', user.id);

    if (myEquipment && myEquipment.length > 0) {
      setMyListedEquipment(myEquipment as MyEquipment[]);
      
      const equipIds = myEquipment.map(e => e.id);
      const { data: incomingEquipBookings } = await supabase
        .from('equipment_bookings')
        .select('*')
        .in('equipment_id', equipIds)
        .order('created_at', { ascending: false });

      if (incomingEquipBookings && incomingEquipBookings.length > 0) {
        const renterIds = [...new Set(incomingEquipBookings.map(b => b.renter_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', renterIds);
        
        const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
        const equipMap = new Map(myEquipment.map(e => [e.id, e]));
        
        setIncomingEquipmentRequests(incomingEquipBookings.map(b => ({
          ...b,
          equipment: equipMap.get(b.equipment_id),
          renter_profile: profileMap.get(b.renter_id)
        })));
      } else {
        setIncomingEquipmentRequests([]);
      }
    } else {
      setMyListedEquipment([]);
    }

    setLoading(false);
  };

  const updateLaborBookingStatus = async (bookingId: string, status: string) => {
    setUpdatingId(bookingId);
    const { error } = await supabase
      .from('labor_bookings')
      .update({ status })
      .eq('id', bookingId);

    if (error) {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    } else {
      toast({ title: `Booking ${status}` });
      fetchAllBookings();
    }
    setUpdatingId(null);
  };

  const updateEquipmentBookingStatus = async (bookingId: string, status: string) => {
    setUpdatingId(bookingId);
    const { error } = await supabase
      .from('equipment_bookings')
      .update({ status })
      .eq('id', bookingId);

    if (error) {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    } else {
      toast({ title: `Booking ${status}` });
      fetchAllBookings();
    }
    setUpdatingId(null);
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const toggleEquipmentAvailability = async (equipmentId: string, currentAvailability: boolean) => {
    setUpdatingId(equipmentId);
    const { error } = await supabase
      .from('equipment')
      .update({ is_available: !currentAvailability })
      .eq('id', equipmentId);

    if (error) {
      toast({ title: 'Failed to update availability', variant: 'destructive' });
    } else {
      toast({ title: `Equipment ${!currentAvailability ? 'available' : 'unavailable'}` });
      fetchAllBookings();
    }
    setUpdatingId(null);
  };

  const deleteEquipment = async (equipmentId: string) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return;
    
    setDeletingId(equipmentId);
    const { error } = await supabase
      .from('equipment')
      .delete()
      .eq('id', equipmentId);

    if (error) {
      toast({ title: 'Failed to delete equipment', variant: 'destructive' });
    } else {
      toast({ title: 'Equipment deleted successfully' });
      fetchAllBookings();
    }
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">My Bookings</h1>

        <Tabs defaultValue="my-labor" className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full">
            <TabsTrigger value="my-labor" className="text-xs md:text-sm">
              My Labor Bookings
              {myLaborBookings.length > 0 && (
                <Badge variant="secondary" className="ml-2">{myLaborBookings.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="incoming-labor" className="text-xs md:text-sm">
              Labor Requests
              {incomingLaborRequests.filter(r => r.status === 'pending').length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {incomingLaborRequests.filter(r => r.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="my-equipment" className="text-xs md:text-sm">
              My Rentals
              {myEquipmentBookings.length > 0 && (
                <Badge variant="secondary" className="ml-2">{myEquipmentBookings.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="incoming-equipment" className="text-xs md:text-sm">
              Rental Requests
              {incomingEquipmentRequests.filter(r => r.status === 'pending').length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {incomingEquipmentRequests.filter(r => r.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="my-listed-equipment" className="text-xs md:text-sm">
              My Equipment
              {myListedEquipment.length > 0 && (
                <Badge variant="secondary" className="ml-2">{myListedEquipment.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* My Labor Bookings */}
          <TabsContent value="my-labor">
            {myLaborBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">You haven't booked any labor groups yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {myLaborBookings.map(booking => (
                  <Card key={booking.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{booking.labor_group?.name || 'Labor Group'}</CardTitle>
                        <Badge className={STATUS_COLORS[booking.status]}>{booking.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.total_workers} workers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">₹{booking.total_amount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Incoming Labor Requests (for group leaders) */}
          <TabsContent value="incoming-labor">
            {incomingLaborRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No booking requests for your labor groups</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {incomingLaborRequests.map(booking => (
                  <Card key={booking.id} className={booking.status === 'pending' ? 'border-primary' : ''}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            Request from {booking.farmer_profile?.full_name || 'Farmer'}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">For: {booking.labor_group?.name}</p>
                        </div>
                        <Badge className={STATUS_COLORS[booking.status]}>{booking.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.total_workers} workers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">₹{booking.total_amount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.farmer_phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.location}</span>
                      </div>
                      {booking.work_description && (
                        <p className="text-sm bg-muted p-2 rounded">{booking.work_description}</p>
                      )}
                      
                      {booking.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            onClick={() => updateLaborBookingStatus(booking.id, 'confirmed')}
                            disabled={updatingId === booking.id}
                          >
                            {updatingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => updateLaborBookingStatus(booking.id, 'cancelled')}
                            disabled={updatingId === booking.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Equipment Bookings */}
          <TabsContent value="my-equipment">
            {myEquipmentBookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Tractor className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">You haven't rented any equipment yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {myEquipmentBookings.map(booking => (
                  <Card key={booking.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{booking.equipment?.name || 'Equipment'}</CardTitle>
                        <Badge className={STATUS_COLORS[booking.status]}>{booking.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">₹{booking.total_amount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{booking.delivery_address}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Incoming Equipment Requests (for equipment owners) */}
          <TabsContent value="incoming-equipment">
            {incomingEquipmentRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Tractor className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No rental requests for your equipment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {incomingEquipmentRequests.map(booking => (
                  <Card key={booking.id} className={booking.status === 'pending' ? 'border-primary' : ''}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            Request from {booking.renter_profile?.full_name || 'User'}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">For: {booking.equipment?.name}</p>
                        </div>
                        <Badge className={STATUS_COLORS[booking.status]}>{booking.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">₹{booking.total_amount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.renter_phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.delivery_address}</span>
                        </div>
                      </div>
                      {booking.notes && (
                        <p className="text-sm bg-muted p-2 rounded">{booking.notes}</p>
                      )}
                      
                      {booking.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            onClick={() => updateEquipmentBookingStatus(booking.id, 'confirmed')}
                            disabled={updatingId === booking.id}
                          >
                            {updatingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => updateEquipmentBookingStatus(booking.id, 'cancelled')}
                            disabled={updatingId === booking.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Listed Equipment */}
          <TabsContent value="my-listed-equipment">
            {myListedEquipment.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">You haven't listed any equipment yet</p>
                  <Button className="mt-4" onClick={() => navigate('/equipment')}>
                    List Equipment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {myListedEquipment.map(equip => (
                  <Card key={equip.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{equip.name}</CardTitle>
                        <Badge className={equip.is_available ? 'bg-green-500' : 'bg-gray-500'}>
                          {equip.is_available ? 'Available' : 'Unavailable'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">₹{equip.price_per_day}/day</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{equip.district || equip.location}</span>
                        </div>
                      </div>
                      {equip.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{equip.description}</p>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleEquipmentAvailability(equip.id, equip.is_available)}
                          disabled={updatingId === equip.id}
                        >
                          {updatingId === equip.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : equip.is_available ? (
                            <><EyeOff className="h-4 w-4 mr-1" /> Hide</>
                          ) : (
                            <><Eye className="h-4 w-4 mr-1" /> Show</>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteEquipment(equip.id)}
                          disabled={deletingId === equip.id}
                        >
                          {deletingId === equip.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <><Trash2 className="h-4 w-4 mr-1" /> Delete</>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
