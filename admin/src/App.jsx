import React, { useState, useEffect } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { 
  LayoutDashboard, 
  Calendar, 
  Bed, 
  Users, 
  Settings, 
  FileText, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  CalendarDays,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';

// Mock data for demonstration
const mockBookings = [
  {
    id: 'BK001',
    guestName: 'ທ້າວ ສົມຊາຍ',
    phoneNumber: '020 5555 1234',
    email: 'somchai@email.com',
    roomName: 'ເຮືອນສາມຫຼ່ຽມ A',
    checkIn: '2024-07-20',
    checkOut: '2024-07-23',
    guests: 2,
    status: 'confirmed',
    totalAmount: 980000,
    depositAmount: 294000,
    remainingAmount: 686000
  },
  {
    id: 'BK002',
    guestName: 'ນາງ ມາລີ',
    phoneNumber: '020 5555 5678',
    email: 'malee@email.com',
    roomName: 'ເຕັນຫຼູຫຼາ B',
    checkIn: '2024-07-25',
    checkOut: '2024-07-27',
    guests: 4,
    status: 'pending',
    totalAmount: 490000,
    depositAmount: 147000,
    remainingAmount: 343000
  }
];

const mockRooms = [
  {
    id: 'R001',
    name: 'ເຮືອນສາມຫຼ່ຽມ A',
    type: 'villa',
    price: 490000,
    status: 'available',
    description: 'ເຮືອນຮູບສາມຫຼ່ຽມທີ່ສະດວກສະບາຍພ້ອມວິວພູທີ່ສວຍງາມ',
    amenities: ['ສະລອງນ້ຳສ່ວນຕົວ', 'ວິວພູເຂົາ', 'ເຕຍງຂະໜາດໃຫຍ່', 'ຫ້ອງນ້ຳຫຼູຫຼາ']
  },
  {
    id: 'R002',
    name: 'ເຕັນຫຼູຫຼາ B',
    type: 'glamping',
    price: 290000,
    status: 'occupied',
    description: 'ເຕັນຫຼູຫຼາພ້ອມສິ່ງອຳນວຍຄວາມສະດວກທັນສະໄໝ',
    amenities: ['ເຕຍງສະດວກສະບາຍ', 'ຫ້ອງນ້ຳສ່ວນຕົວ', 'ເຄື່ອງປັບອາກາດ', 'ວິວທິວທັດ']
  }
];

const mockUsers = [
  {
    id: 'U001',
    name: 'ທ້າວ ບຸນມີ',
    email: 'bunmee@kanghanvalley.com',
    role: 'manager',
    createdAt: '2024-01-15'
  },
  {
    id: 'U002',
    name: 'ນາງ ສີດາ',
    email: 'sida@kanghanvalley.com',
    role: 'reception',
    createdAt: '2024-02-01'
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login - in real app, this would validate against Firebase Auth
    if (loginForm.email && loginForm.password) {
      setIsLoggedIn(true);
    }
  };

  // Modal handlers
  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
    setFormData({});
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      confirmed: { label: 'ຢືນຢັນແລ້ວ', color: 'bg-green-100 text-green-800' },
      pending: { label: 'ລໍຖ້າ', color: 'bg-yellow-100 text-yellow-800' },
      checked_in: { label: 'ເຊັກອິນແລ້ວ', color: 'bg-blue-100 text-blue-800' },
      checked_out: { label: 'ເຊັກເອົາແລ້ວ', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'ຍົກເລີກ', color: 'bg-red-100 text-red-800' },
      available: { label: 'ພ້ອມໃຊ້ງານ', color: 'bg-green-100 text-green-800' },
      occupied: { label: 'ມີແຂກເຂົ້າພັກ', color: 'bg-red-100 text-red-800' },
      maintenance: { label: 'ບຳລຸງຮັກສາ', color: 'bg-orange-100 text-orange-800' }
    };
    
    const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  // Login page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img 
              src="/src/assets/kanghan_valley_logo.png" 
              alt="Logo" 
              className="h-16 w-16 mx-auto mb-4"
            />
            <CardTitle className="text-2xl">ລະບົບຈັດການ</CardTitle>
            <p className="text-gray-600">Kanghan Valley Resort & Camping</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">ອີເມວ</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  placeholder="ໃສ່ອີເມວຂອງທ່ານ"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">ລະຫັດຜ່ານ</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  placeholder="ໃສ່ລະຫັດຜ່ານ"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                ເຂົ້າສູ່ລະບົບ
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 border-b">
          <img 
            src="/src/assets/kanghan_valley_logo.png" 
            alt="Logo" 
            className="h-8 w-8 mr-2"
          />
          <span className="text-lg font-bold">ລະບົບຈັດການ</span>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                currentPage === 'dashboard' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              ພາບລວມ
            </button>
            
            <button
              onClick={() => setCurrentPage('bookings')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                currentPage === 'bookings' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-5 w-5 mr-3" />
              ການຈອງ
            </button>
            
            <button
              onClick={() => setCurrentPage('rooms')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                currentPage === 'rooms' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Bed className="h-5 w-5 mr-3" />
              ການຈັດການຫ້ອງພັກ
            </button>
            
            <button
              onClick={() => setCurrentPage('users')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                currentPage === 'users' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              ການຈັດການຜູ້ໃຊ້
            </button>
            
            <button
              onClick={() => setCurrentPage('website')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                currentPage === 'website' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              ການຈັດການເວັບໄຊ
            </button>
            
            <button
              onClick={() => setCurrentPage('invoice-settings')}
              className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors ${
                currentPage === 'invoice-settings' ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="h-5 w-5 mr-3" />
              ຕັ້ງຄ່າໃບເກັບເງິນ
            </button>
          </div>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            onClick={() => setIsLoggedIn(false)}
            variant="outline" 
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            ອອກຈາກລະບົບ
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentPage === 'dashboard' && 'ພາບລວມ'}
            {currentPage === 'bookings' && 'ການຈອງ'}
            {currentPage === 'rooms' && 'ການຈັດການຫ້ອງພັກ'}
            {currentPage === 'users' && 'ການຈັດການຜູ້ໃຊ້'}
            {currentPage === 'website' && 'ການຈັດການເວັບໄຊ'}
            {currentPage === 'invoice-settings' && 'ຕັ້ງຄ່າໃບເກັບເງິນ'}
          </h1>
        </div>

        {/* Dashboard Content */}
        {currentPage === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ການຈອງມື້ນີ້</p>
                      <p className="text-2xl font-bold">5</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ຫ້ອງວ່າງ</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <Bed className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ລາຍຮັບເດືອນນີ້</p>
                      <p className="text-2xl font-bold">15.2M</p>
                      <p className="text-xs text-gray-500">LAK</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ອັດຕາການຈອງ</p>
                      <p className="text-2xl font-bold">85%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>ການຈອງລ່າສຸດ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{booking.guestName}</p>
                          <p className="text-sm text-gray-600">{booking.roomName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={booking.status} />
                        <p className="text-sm text-gray-600 mt-1">
                          {booking.checkIn} - {booking.checkOut}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bookings Page */}
        {currentPage === 'bookings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="ຄົ້ນຫາການຈອງ..." className="pl-10 w-64" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  ຕົວກອງ
                </Button>
              </div>
              <Button 
                onClick={() => openModal('add-booking')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                ເພີ່ມການຈອງ
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ລະຫັດ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ຊື່ແຂກ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ຫ້ອງ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ວັນທີ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ສະຖານະ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ຈຳນວນເງິນ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ການດຳເນີນການ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {booking.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                              <div className="text-sm text-gray-500">{booking.phoneNumber}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.roomName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.checkIn} - {booking.checkOut}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.totalAmount.toLocaleString()} LAK
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Rooms Page */}
        {currentPage === 'rooms' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="ຄົ້ນຫາຫ້ອງ..." className="pl-10 w-64" />
                </div>
              </div>
              <Button 
                onClick={() => openModal('add-room')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                ເພີ່ມຫ້ອງໃໝ່
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRooms.map((room) => (
                <Card key={room.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{room.name}</CardTitle>
                        <p className="text-sm text-gray-600">{room.type}</p>
                      </div>
                      <StatusBadge status={room.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{room.description}</p>
                    <div className="space-y-2 mb-4">
                      {room.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="mr-2">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">{room.price.toLocaleString()} LAK</span>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Users Page */}
        {currentPage === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="ຄົ້ນຫາຜູ້ໃຊ້..." className="pl-10 w-64" />
                </div>
              </div>
              <Button 
                onClick={() => openModal('add-user')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                ເພີ່ມຜູ້ໃຊ້ໃໝ່
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ຊື່
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ອີເມວ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ບົດບາດ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ວັນທີສ້າງ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ການດຳເນີນການ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={
                              user.role === 'manager' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'reception' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {user.role === 'manager' ? 'ຜູ້ຈັດການ' :
                               user.role === 'reception' ? 'ພນັກງານຕ້ອນຮັບ' :
                               user.role === 'housekeeping' ? 'ແມ່ບ້ານ' : user.role}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.createdAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Website Management Page */}
        {currentPage === 'website' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>ຈັດການຮູບພາບ Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      ອັບໂຫຼດຮູບໃໝ່
                    </Button>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="relative aspect-square bg-gray-200 rounded-lg">
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ຂໍ້ມູນຕິດຕໍ່</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Facebook Messenger Link</Label>
                      <Input placeholder="https://m.me/..." />
                    </div>
                    <div>
                      <Label>WhatsApp Link</Label>
                      <Input placeholder="https://wa.me/..." />
                    </div>
                    <div>
                      <Label>ອີເມວ</Label>
                      <Input placeholder="info@kanghanvalley.com" />
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      ບັນທຶກ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Invoice Settings Page */}
        {currentPage === 'invoice-settings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>ຂໍ້ມູນຣີສອດ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>ຊື່ຣີສອດ</Label>
                      <Input defaultValue="Kanghan Valley Resort & Camping" />
                    </div>
                    <div>
                      <Label>ເບີໂທລະສັບ</Label>
                      <Input defaultValue="+856 20 9674 8657, +856 20 9980 4879" />
                    </div>
                    <div>
                      <Label>ທີ່ຢູ່</Label>
                      <Textarea defaultValue="Kanghan Valley, ລາວ" />
                    </div>
                    <div>
                      <Label>ອັບໂຫຼດໂລໂກ້</Label>
                      <Button variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        ເລືອກໄຟລ໌
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ການຕັ້ງຄ່າການຊຳລະເງິນ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>ເປີເຊັນເງິນມັດຈຳ (%)</Label>
                      <Input type="number" defaultValue="30" />
                    </div>
                    <div>
                      <Label>ສະກຸນເງິນ</Label>
                      <Input defaultValue="LAK" />
                    </div>
                    <div>
                      <Label>ຂໍ້ມູນບັນຊີທະນາຄານ</Label>
                      <Textarea placeholder="ຊື່ທະນາຄານ, ຊື່ບັນຊີ, ເລກບັນຊີ" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>ຂໍ້ຄວາມໝາຍເຫດ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea 
                      rows={6}
                      defaultValue="ກະລຸນາຊໍາລະຄ່າມັດຈໍາກ່ອນລ່ວງຫນ້າ 1 ມື້, ຖ້າຫາກບໍ່ຊໍາລະເງິນຄ່າມັດຈໍາ ການຈອງຈະເປັນໂມຄະ.&#10;ຄ່າທໍານຽມທີ່ໄດ້ຊໍາລະໄວ້ຈະບໍ່ສາມາດຂໍຄືນໄດ້ຖ້າຫາກຍົກເລີກການຈອງ&#10;**Check-in 14:00&#10;**Check-out 11:00"
                    />
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Save className="h-4 w-4 mr-2" />
                      ບັນທຶກການຕັ້ງຄ່າ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {modalType === 'add-booking' && 'ເພີ່ມການຈອງໃໝ່'}
                {modalType === 'add-room' && 'ເພີ່ມຫ້ອງໃໝ່'}
                {modalType === 'add-user' && 'ເພີ່ມຜູ້ໃຊ້ໃໝ່'}
              </h3>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {modalType === 'add-booking' && (
              <div className="space-y-4">
                <div>
                  <Label>ຊື່ແຂກ</Label>
                  <Input placeholder="ໃສ່ຊື່ແຂກ" />
                </div>
                <div>
                  <Label>ເບີໂທລະສັບ</Label>
                  <Input placeholder="020 xxxx xxxx" />
                </div>
                <div>
                  <Label>ອີເມວ</Label>
                  <Input type="email" placeholder="email@example.com" />
                </div>
                <div>
                  <Label>ເລືອກຫ້ອງ</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option>ເລືອກຫ້ອງ</option>
                    {mockRooms.map(room => (
                      <option key={room.id} value={room.id}>{room.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ວັນທີ Check-in</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>ວັນທີ Check-out</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div>
                  <Label>ຈຳນວນຜູ້ເຂົ້າພັກ</Label>
                  <Input type="number" min="1" defaultValue="1" />
                </div>
                <div>
                  <Label>ໝາຍເຫດ</Label>
                  <Textarea placeholder="ໝາຍເຫດເພີ່ມເຕີມ" />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={closeModal} variant="outline" className="flex-1">
                    ຍົກເລີກ
                  </Button>
                  <Button onClick={closeModal} className="flex-1 bg-green-600 hover:bg-green-700">
                    ບັນທຶກ
                  </Button>
                </div>
              </div>
            )}

            {modalType === 'add-room' && (
              <div className="space-y-4">
                <div>
                  <Label>ຊື່ຫ້ອງ</Label>
                  <Input placeholder="ເຊັ່ນ: ເຮືອນສາມຫຼ່ຽມ A" />
                </div>
                <div>
                  <Label>ປະເພດຫ້ອງ</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="villa">ວິລລ່າຫຼູຫຼາ</option>
                    <option value="glamping">ເຕັນຫຼູຫຼາ</option>
                    <option value="camping">ເຂດແຄມປິ້ງ</option>
                  </select>
                </div>
                <div>
                  <Label>ລາຄາຕໍ່ຄືນ (LAK)</Label>
                  <Input type="number" placeholder="490000" />
                </div>
                <div>
                  <Label>ລາຍລະອຽດ</Label>
                  <Textarea placeholder="ອະທິບາຍຫ້ອງ" />
                </div>
                <div>
                  <Label>ສິ່ງອຳນວຍຄວາມສະດວກ</Label>
                  <Input placeholder="ແຍກດ້ວຍເຄື່ອງໝາຍຈຸດ" />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={closeModal} variant="outline" className="flex-1">
                    ຍົກເລີກ
                  </Button>
                  <Button onClick={closeModal} className="flex-1 bg-green-600 hover:bg-green-700">
                    ບັນທຶກ
                  </Button>
                </div>
              </div>
            )}

            {modalType === 'add-user' && (
              <div className="space-y-4">
                <div>
                  <Label>ຊື່ຜູ້ໃຊ້</Label>
                  <Input placeholder="ໃສ່ຊື່ຜູ້ໃຊ້" />
                </div>
                <div>
                  <Label>ອີເມວ</Label>
                  <Input type="email" placeholder="email@example.com" />
                </div>
                <div>
                  <Label>ລະຫັດຜ່ານ</Label>
                  <Input type="password" placeholder="ໃສ່ລະຫັດຜ່ານ" />
                </div>
                <div>
                  <Label>ບົດບາດ</Label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="manager">ຜູ້ຈັດການ</option>
                    <option value="reception">ພນັກງານຕ້ອນຮັບ</option>
                    <option value="housekeeping">ແມ່ບ້ານ</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={closeModal} variant="outline" className="flex-1">
                    ຍົກເລີກ
                  </Button>
                  <Button onClick={closeModal} className="flex-1 bg-green-600 hover:bg-green-700">
                    ສ້າງຜູ້ໃຊ້
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

