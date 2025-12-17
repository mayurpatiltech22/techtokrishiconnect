import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Search, MapPin, Users, Star, Calendar, Loader2, Plus, IndianRupee } from 'lucide-react';

interface LaborGroup {
  id: string;
  name: string;
  description: string | null;
  district: string | null;
  taluka: string | null;
  skills: string[] | null;
  daily_rate: number | null;
  member_count: number | null;
  is_available: boolean | null;
  rating: number | null;
  total_reviews: number | null;
  image_url: string | null;
  leader_id: string;
}

const MAHARASHTRA_DISTRICTS = [
  'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 
  'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 
  'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 
  'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 
  'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 
  'Washim', 'Yavatmal'
];

export default function Labor() {
  const [groups, setGroups] = useState<LaborGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [bookingGroup, setBookingGroup] = useState<LaborGroup | null>(null);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    workers: 1,
    description: '',
    phone: '',
    location: ''
  });
  const [isBooking, setIsBooking] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('labor_groups')
      .select('*')
      .eq('is_available', true);

    if (data) setGroups(data);
    setLoading(false);
  };

  const filteredGroups = groups.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         g.skills?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDistrict = selectedDistrict === 'all' || g.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: 'Please login to book', variant: 'destructive' });
      navigate('/auth');
      return;
    }

    if (!bookingGroup) return;

    setIsBooking(true);

    try {
      const startDate = new Date(bookingData.startDate);
      const endDate = new Date(bookingData.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const totalAmount = (bookingGroup.daily_rate || 0) * bookingData.workers * days;

      const { error } = await supabase
        .from('labor_bookings')
        .insert({
          labor_group_id: bookingGroup.id,
          farmer_id: user.id,
          start_date: bookingData.startDate,
          end_date: bookingData.endDate,
          total_workers: bookingData.workers,
          work_description: bookingData.description,
          farmer_phone: bookingData.phone,
          location: bookingData.location,
          total_amount: totalAmount,
          status: 'pending'
        });

      if (error) throw error;

      toast({ title: 'Booking request sent successfully!' });
      setBookingGroup(null);
      setBookingData({ startDate: '', endDate: '', workers: 1, description: '', phone: '', location: '' });
    } catch (error: any) {
      toast({ title: error.message || 'Failed to book', variant: 'destructive' });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Labor Groups</h1>
            <p className="text-muted-foreground">Find and hire skilled agricultural workers</p>
          </div>
          <Button asChild>
            <Link to="/labor/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Labor Group
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
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

        {/* Labor Groups Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    {group.is_available && (
                      <Badge variant="default" className="bg-primary">Available</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{group.taluka}, {group.district}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{group.member_count} Workers</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">₹{group.daily_rate}/day per worker</span>
                  </div>

                  {group.rating && group.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-medium">{group.rating}</span>
                      <span className="text-muted-foreground">({group.total_reviews} reviews)</span>
                    </div>
                  )}

                  {group.skills && group.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {group.skills.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => setBookingGroup(group)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Book {group.name}</DialogTitle>
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
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="workers">Number of Workers</Label>
                          <Input
                            id="workers"
                            type="number"
                            min="1"
                            max={group.member_count || 10}
                            value={bookingData.workers}
                            onChange={(e) => setBookingData({ ...bookingData, workers: parseInt(e.target.value) })}
                            required
                          />
                        </div>
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
                          <Label htmlFor="location">Work Location</Label>
                          <Input
                            id="location"
                            placeholder="Village, Taluka, District"
                            value={bookingData.location}
                            onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Work Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Describe the work required..."
                            value={bookingData.description}
                            onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={isBooking}>
                          {isBooking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Send Booking Request
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No labor groups found</h2>
            <p className="text-muted-foreground mb-4">Be the first to create a labor group in your area</p>
            <Button asChild>
              <Link to="/labor/create">Create Labor Group</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
