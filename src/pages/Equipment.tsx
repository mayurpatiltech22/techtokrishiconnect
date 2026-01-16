import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Search, MapPin, Calendar, Loader2, Tractor, IndianRupee, Clock, Wrench, Plus } from 'lucide-react';
import { AddEquipmentForm } from '@/components/AddEquipmentForm';

interface Equipment {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price_per_day: number;
  location: string | null;
  district: string | null;
  is_available: boolean | null;
  specifications: string[] | null;
  category: string | null;
}

const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 
  'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 
  'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 
  'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 
  'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 
  'Washim', 'Yavatmal'
];

const EQUIPMENT_CATEGORIES = ['All', 'Tractor', 'Tillage', 'Harvester', 'Planting', 'Sprayer'];

const CATEGORY_ICONS: Record<string, string> = {
  'Tractor': '🚜',
  'Tillage': '🔧',
  'Harvester': '🌾',
  'Planting': '🌱',
  'Sprayer': '💨'
};

export default function Equipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [bookingEquipment, setBookingEquipment] = useState<Equipment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [isBooking, setIsBooking] = useState(false);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .eq('is_available', true);

    if (data) setEquipment(data);
    setLoading(false);
  };

  const filteredEquipment = equipment.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = selectedDistrict === 'all' || e.district === selectedDistrict;
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesDistrict && matchesCategory;
  });

  const calculateTotalAmount = () => {
    if (!bookingEquipment || !bookingData.startDate || !bookingData.endDate) return 0;
    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return bookingEquipment.price_per_day * Math.max(1, days);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: 'Please login to book equipment', variant: 'destructive' });
      navigate('/auth');
      return;
    }

    if (!bookingEquipment) return;

    const startDate = new Date(bookingData.startDate);
    const endDate = new Date(bookingData.endDate);
    
    if (endDate < startDate) {
      toast({ title: 'End date must be after start date', variant: 'destructive' });
      return;
    }

    setIsBooking(true);

    try {
      const totalAmount = calculateTotalAmount();

      const { error } = await supabase
        .from('equipment_bookings')
        .insert({
          equipment_id: bookingEquipment.id,
          renter_id: user.id,
          start_date: bookingData.startDate,
          end_date: bookingData.endDate,
          renter_phone: bookingData.phone,
          delivery_address: bookingData.address,
          notes: bookingData.notes,
          total_amount: totalAmount,
          status: 'pending'
        });

      if (error) throw error;

      toast({ title: 'Booking request sent successfully!' });
      setDialogOpen(false);
      setBookingEquipment(null);
      setBookingData({ startDate: '', endDate: '', phone: '', address: '', notes: '' });
    } catch (error: any) {
      toast({ title: error.message || 'Failed to book equipment', variant: 'destructive' });
    } finally {
      setIsBooking(false);
    }
  };

  const openBookingDialog = (equip: Equipment) => {
    setBookingEquipment(equip);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
              <Tractor className="h-8 w-8" />
              Equipment Rental
            </h1>
            <p className="text-muted-foreground">Rent tractors, harvesters, and farming tools at affordable rates</p>
          </div>
          <Button 
            onClick={() => {
              if (!user) {
                toast({ title: 'Please login to list equipment', variant: 'destructive' });
                navigate('/auth');
                return;
              }
              setShowAddEquipment(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            List Your Equipment
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Wrench className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {EQUIPMENT_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-full md:w-[200px]">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {MAHARASHTRA_DISTRICTS.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Equipment Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEquipment.map(equip => (
              <Card key={equip.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-40 bg-muted relative flex items-center justify-center">
                  <span className="text-6xl">{CATEGORY_ICONS[equip.category || ''] || '🔧'}</span>
                  <Badge 
                    className="absolute top-3 right-3 bg-primary"
                  >
                    Available
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{equip.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {equip.location || equip.district}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{equip.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-primary" />
                    <span className="text-xl font-bold text-primary">₹{equip.price_per_day}</span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      per day
                    </span>
                  </div>

                  {equip.specifications && equip.specifications.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground">Specifications:</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        {equip.specifications.slice(0, 3).map((spec, index) => (
                          <li key={index}>• {spec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => openBookingDialog(equip)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <Tractor className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No equipment found</h2>
            <p className="text-muted-foreground">Try adjusting your search filters</p>
          </div>
        )}
      </main>

      {/* Booking Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book {bookingEquipment?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBooking} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={bookingData.endDate}
                  onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                  min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            {bookingData.startDate && bookingData.endDate && (
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Amount:</span>
                  <span className="text-lg font-bold text-primary">₹{calculateTotalAmount()}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">Your Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={bookingData.phone}
                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address</Label>
              <Input
                id="address"
                placeholder="Village, Taluka, District"
                value={bookingData.address}
                onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special requirements..."
                value={bookingData.notes}
                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isBooking}>
              {isBooking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Send Booking Request
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Equipment Form */}
      <AddEquipmentForm
        isOpen={showAddEquipment}
        onClose={() => setShowAddEquipment(false)}
        onSuccess={() => fetchEquipment()}
      />

      <Footer />
    </div>
  );
}
