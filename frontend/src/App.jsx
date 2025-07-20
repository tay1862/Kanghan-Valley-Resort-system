import React, { useState, useEffect } from 'react';
import './App.css';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Star, 
  Wifi, 
  Car, 
  Coffee, 
  Waves, 
  Mountain, 
  Trees,
  Globe,
  Menu,
  X,
  ChevronDown,
  Facebook,
  Instagram,
  Send
} from 'lucide-react';

// Language Context
const LanguageContext = React.createContext();

const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      accommodations: 'Accommodations',
      facilities: 'Facilities',
      gallery: 'Gallery',
      contact: 'Contact'
    },
    hero: {
      title: 'Welcome to Kanghan Valley Resort & Camping',
      subtitle: 'Your Sanctuary in Nature\'s Embrace',
      bookNow: 'Book Your Stay',
      explore: 'Explore Our Resort'
    },
    about: {
      title: 'About Kanghan Valley',
      description: 'Nestled in the heart of pristine nature, Kanghan Valley Resort & Camping offers a perfect blend of luxury and adventure. Our resort features stunning mountain views, crystal-clear waters, and world-class amenities designed to create unforgettable memories.',
      experience: 'Experience the perfect harmony between luxury comfort and natural beauty.'
    },
    accommodations: {
      title: 'Accommodations',
      subtitle: 'Choose Your Perfect Retreat',
      villa: {
        title: 'Luxury Villas',
        description: 'Spacious villas with private pools and mountain views',
        features: ['Private Pool', 'Mountain View', 'King Size Bed', 'Luxury Bathroom']
      },
      glamping: {
        title: 'Glamping Tents',
        description: 'Luxury camping experience with all modern amenities',
        features: ['Comfortable Bed', 'Private Bathroom', 'Air Conditioning', 'Scenic Views']
      },
      camping: {
        title: 'Camping Zone',
        description: 'Traditional camping with shared facilities',
        features: ['Shared Bathrooms', 'Fire Pit Area', 'Picnic Tables', 'Nature Trails']
      },
      inquire: 'Inquire Now'
    },
    facilities: {
      title: 'Facilities & Services',
      restaurant: {
        title: 'The Valley Restaurant',
        description: 'Fine dining with local and international cuisine'
      },
      pool: {
        title: 'Infinity Pool',
        description: 'Stunning pool with panoramic mountain views'
      },
      spa: {
        title: 'Spa & Wellness',
        description: 'Rejuvenating treatments in natural surroundings'
      },
      activities: {
        title: 'Activities',
        description: 'Hiking, cycling, and outdoor adventures'
      }
    },
    gallery: {
      title: 'Gallery',
      subtitle: 'Discover the Beauty of Kanghan Valley'
    },
    contact: {
      title: 'Contact & Booking',
      subtitle: 'Get in Touch with Us',
      facebook: 'Facebook Messenger',
      whatsapp: 'WhatsApp',
      email: 'Email Us',
      form: {
        name: 'Your Name',
        email: 'Email Address',
        subject: 'Subject',
        message: 'Message',
        send: 'Send Message'
      },
      info: {
        address: 'Kanghan Valley, Laos',
        phone: '+856 20 9674 8657',
        email: 'info@kanghanvalley.com'
      }
    }
  },
  lo: {
    nav: {
      home: 'ໜ້າຫຼັກ',
      about: 'ກ່ຽວກັບ',
      accommodations: 'ທີ່ພັກ',
      facilities: 'ສິ່ງອຳນວຍຄວາມສະດວກ',
      gallery: 'ແກລເລີຣີ',
      contact: 'ຕິດຕໍ່'
    },
    hero: {
      title: 'ຍິນດີຕ້ອນຮັບສູ່ Kanghan Valley Resort & Camping',
      subtitle: 'ບ່ອນພັກຜ່ອນໃນອ້ອມກອດຂອງທຳມະຊາດ',
      bookNow: 'ຈອງທີ່ພັກ',
      explore: 'ສຳຫຼວດຣີສອດ'
    },
    about: {
      title: 'ກ່ຽວກັບ Kanghan Valley',
      description: 'ຕັ້ງຢູ່ໃນໃຈກາງຂອງທຳມະຊາດທີ່ບໍລິສຸດ, Kanghan Valley Resort & Camping ສະເໜີການຜະສົມຜະສານທີ່ສົມບູນແບບລະຫວ່າງຄວາມຫຼູຫຼາແລະການຜະຈົນໄພ.',
      experience: 'ປະສົບການຄວາມກົມກຽວທີ່ສົມບູນແບບລະຫວ່າງຄວາມສະດວກສະບາຍແລະຄວາມງາມຂອງທຳມະຊາດ.'
    },
    accommodations: {
      title: 'ທີ່ພັກ',
      subtitle: 'ເລືອກບ່ອນພັກຜ່ອນທີ່ສົມບູນແບບ',
      villa: {
        title: 'ວິລລ່າຫຼູຫຼາ',
        description: 'ວິລລ່າກວ້າງຂວາງພ້ອມສະລອງນ້ຳສ່ວນຕົວແລະວິວພູເຂົາ',
        features: ['ສະລອງນ້ຳສ່ວນຕົວ', 'ວິວພູເຂົາ', 'ເຕຍງຂະໜາດໃຫຍ່', 'ຫ້ອງນ້ຳຫຼູຫຼາ']
      },
      glamping: {
        title: 'ເຕັນຫຼູຫຼາ',
        description: 'ປະສົບການແຄມປິ້ງຫຼູຫຼາພ້ອມສິ່ງອຳນວຍຄວາມສະດວກທັນສະໄໝ',
        features: ['ເຕຍງສະດວກສະບາຍ', 'ຫ້ອງນ້ຳສ່ວນຕົວ', 'ເຄື່ອງປັບອາກາດ', 'ວິວທິວທັດ']
      },
      camping: {
        title: 'ເຂດແຄມປິ້ງ',
        description: 'ແຄມປິ້ງແບບດັ້ງເດີມພ້ອມສິ່ງອຳນວຍຄວາມສະດວກຮ່ວມ',
        features: ['ຫ້ອງນ້ຳຮ່ວມ', 'ບ່ອນຈູດໄຟ', 'ໂຕະປິກນິກ', 'ເສັ້ນທາງທຳມະຊາດ']
      },
      inquire: 'ສອບຖາມ'
    },
    facilities: {
      title: 'ສິ່ງອຳນວຍຄວາມສະດວກ',
      restaurant: {
        title: 'ຮ້ານອາຫານ The Valley',
        description: 'ອາຫານລະດັບສູງທັ້ງທ້ອງຖິ່ນແລະສາກົນ'
      },
      pool: {
        title: 'ສະລອງນ້ຳອິນຟິນິຕີ້',
        description: 'ສະລອງນ້ຳທີ່ງາມພ້ອມວິວພູເຂົາ 360 ອົງສາ'
      },
      spa: {
        title: 'ສະປາ & ສຸຂະພາບ',
        description: 'ການບຳບັດຟື້ນຟູໃນສະພາບແວດລ້ອມທຳມະຊາດ'
      },
      activities: {
        title: 'ກິດຈະກຳ',
        description: 'ການຍ່າງປ່າ, ຂີ່ລົດຖີບ, ແລະການຜະຈົນໄພກາງແຈ້ງ'
      }
    },
    gallery: {
      title: 'ແກລເລີຣີ',
      subtitle: 'ຄົ້ນພົບຄວາມງາມຂອງ Kanghan Valley'
    },
    contact: {
      title: 'ຕິດຕໍ່ & ຈອງ',
      subtitle: 'ຕິດຕໍ່ພວກເຮົາ',
      facebook: 'Facebook Messenger',
      whatsapp: 'WhatsApp',
      email: 'ອີເມວ',
      form: {
        name: 'ຊື່ຂອງທ່ານ',
        email: 'ທີ່ຢູ່ອີເມວ',
        subject: 'ຫົວຂໍ້',
        message: 'ຂໍ້ຄວາມ',
        send: 'ສົ່ງຂໍ້ຄວາມ'
      },
      info: {
        address: 'Kanghan Valley, ລາວ',
        phone: '+856 20 9674 8657',
        email: 'info@kanghanvalley.com'
      }
    }
  },
  th: {
    nav: {
      home: 'หน้าหลัก',
      about: 'เกี่ยวกับ',
      accommodations: 'ที่พัก',
      facilities: 'สิ่งอำนวยความสะดวก',
      gallery: 'แกลเลอรี่',
      contact: 'ติดต่อ'
    },
    hero: {
      title: 'ยินดีต้อนรับสู่ Kanghan Valley Resort & Camping',
      subtitle: 'ที่พักผ่อนในอ้อมกอดของธรรมชาติ',
      bookNow: 'จองที่พัก',
      explore: 'สำรวจรีสอร์ท'
    },
    about: {
      title: 'เกี่ยวกับ Kanghan Valley',
      description: 'ตั้งอยู่ในใจกลางของธรรมชาติที่บริสุทธิ์ Kanghan Valley Resort & Camping นำเสนอการผสมผสานที่สมบูรณ์แบบระหว่างความหรูหราและการผจญภัย',
      experience: 'สัมผัสความกลมกลืนที่สมบูรณ์แบบระหว่างความสะดวกสบายและความงามของธรรมชาติ'
    },
    accommodations: {
      title: 'ที่พัก',
      subtitle: 'เลือกที่พักผ่อนที่สมบูรณ์แบบ',
      villa: {
        title: 'วิลล่าหรู',
        description: 'วิลล่ากว้างขวางพร้อมสระส่วนตัวและวิวภูเขา',
        features: ['สระส่วนตัว', 'วิวภูเขา', 'เตียงคิงไซส์', 'ห้องน้ำหรู']
      },
      glamping: {
        title: 'เต็นท์หรู',
        description: 'ประสบการณ์แคมปิ้งหรูพร้อมสิ่งอำนวยความสะดวกทันสมัย',
        features: ['เตียงสะดวกสบาย', 'ห้องน้ำส่วนตัว', 'เครื่องปรับอากาศ', 'วิวทิวทัศน์']
      },
      camping: {
        title: 'โซนแคมปิ้ง',
        description: 'แคมปิ้งแบบดั้งเดิมพร้อมสิ่งอำนวยความสะดวกร่วม',
        features: ['ห้องน้ำร่วม', 'บริเวณจุดไฟ', 'โต๊ะปิกนิก', 'เส้นทางธรรมชาติ']
      },
      inquire: 'สอบถาม'
    },
    facilities: {
      title: 'สิ่งอำนวยความสะดวก',
      restaurant: {
        title: 'ร้านอาหาร The Valley',
        description: 'อาหารระดับสูงทั้งท้องถิ่นและนานาชาติ'
      },
      pool: {
        title: 'สระอินฟินิตี้',
        description: 'สระที่งดงามพร้อมวิวภูเขา 360 องศา'
      },
      spa: {
        title: 'สปา & เวลเนส',
        description: 'การบำบัดฟื้นฟูในสภาพแวดล้อมธรรมชาติ'
      },
      activities: {
        title: 'กิจกรรม',
        description: 'การเดินป่า ปั่นจักรยาน และการผจญภัยกลางแจ้ง'
      }
    },
    gallery: {
      title: 'แกลเลอรี่',
      subtitle: 'ค้นพบความงามของ Kanghan Valley'
    },
    contact: {
      title: 'ติดต่อ & จอง',
      subtitle: 'ติดต่อเรา',
      facebook: 'Facebook Messenger',
      whatsapp: 'WhatsApp',
      email: 'อีเมล',
      form: {
        name: 'ชื่อของคุณ',
        email: 'ที่อยู่อีเมล',
        subject: 'หัวข้อ',
        message: 'ข้อความ',
        send: 'ส่งข้อความ'
      },
      info: {
        address: 'Kanghan Valley, ลาว',
        phone: '+856 20 9674 8657',
        email: 'info@kanghanvalley.com'
      }
    }
  }
};

function App() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const t = translations[currentLanguage];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage, t }}>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <img 
                  src="/src/assets/kanghan_valley_logo.png" 
                  alt="Kanghan Valley Logo" 
                  className="h-10 w-10"
                />
                <span className="text-xl font-bold text-gray-900">Kanghan Valley</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-green-600 transition-colors">
                  {t.nav.home}
                </button>
                <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-green-600 transition-colors">
                  {t.nav.about}
                </button>
                <button onClick={() => scrollToSection('accommodations')} className="text-gray-700 hover:text-green-600 transition-colors">
                  {t.nav.accommodations}
                </button>
                <button onClick={() => scrollToSection('facilities')} className="text-gray-700 hover:text-green-600 transition-colors">
                  {t.nav.facilities}
                </button>
                <button onClick={() => scrollToSection('gallery')} className="text-gray-700 hover:text-green-600 transition-colors">
                  {t.nav.gallery}
                </button>
                <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-green-600 transition-colors">
                  {t.nav.contact}
                </button>
              </div>

              {/* Language Selector & Mobile Menu */}
              <div className="flex items-center space-x-4">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="uppercase text-sm font-medium">{currentLanguage}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {isLanguageOpen && (
                    <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg border border-gray-200">
                      <button
                        onClick={() => { setCurrentLanguage('en'); setIsLanguageOpen(false); }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        EN
                      </button>
                      <button
                        onClick={() => { setCurrentLanguage('lo'); setIsLanguageOpen(false); }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        LO
                      </button>
                      <button
                        onClick={() => { setCurrentLanguage('th'); setIsLanguageOpen(false); }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        TH
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden text-gray-700 hover:text-green-600"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden border-t border-gray-100 py-4">
                <div className="flex flex-col space-y-3">
                  <button onClick={() => scrollToSection('home')} className="text-left text-gray-700 hover:text-green-600 transition-colors">
                    {t.nav.home}
                  </button>
                  <button onClick={() => scrollToSection('about')} className="text-left text-gray-700 hover:text-green-600 transition-colors">
                    {t.nav.about}
                  </button>
                  <button onClick={() => scrollToSection('accommodations')} className="text-left text-gray-700 hover:text-green-600 transition-colors">
                    {t.nav.accommodations}
                  </button>
                  <button onClick={() => scrollToSection('facilities')} className="text-left text-gray-700 hover:text-green-600 transition-colors">
                    {t.nav.facilities}
                  </button>
                  <button onClick={() => scrollToSection('gallery')} className="text-left text-gray-700 hover:text-green-600 transition-colors">
                    {t.nav.gallery}
                  </button>
                  <button onClick={() => scrollToSection('contact')} className="text-left text-gray-700 hover:text-green-600 transition-colors">
                    {t.nav.contact}
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="relative h-screen flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/src/assets/valley_landscape_2.jpeg')`
            }}
          />
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                onClick={() => scrollToSection('contact')}
              >
                {t.hero.bookNow}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3"
                onClick={() => scrollToSection('about')}
              >
                {t.hero.explore}
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {t.about.title}
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {t.about.description}
                </p>
                <p className="text-lg text-green-600 font-medium">
                  {t.about.experience}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="/src/assets/luxury_resort_exterior_1.jpg" 
                  alt="Resort Exterior" 
                  className="rounded-lg shadow-lg"
                />
                <img 
                  src="/src/assets/luxury_resort_interior_1.jpg" 
                  alt="Resort Interior" 
                  className="rounded-lg shadow-lg mt-8"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Accommodations Section */}
        <section id="accommodations" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t.accommodations.title}
              </h2>
              <p className="text-lg text-gray-600">
                {t.accommodations.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Villa */}
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64">
                  <img 
                    src="/src/assets/luxury_resort_exterior_2.jpg" 
                    alt="Luxury Villa" 
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-600">
                    Premium
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t.accommodations.villa.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t.accommodations.villa.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {t.accommodations.villa.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 text-green-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => scrollToSection('contact')}
                  >
                    {t.accommodations.inquire}
                  </Button>
                </CardContent>
              </Card>

              {/* Glamping */}
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64">
                  <img 
                    src="/src/assets/glamping_1.jpg" 
                    alt="Glamping Tent" 
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600">
                    Popular
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t.accommodations.glamping.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t.accommodations.glamping.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {t.accommodations.glamping.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 text-green-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => scrollToSection('contact')}
                  >
                    {t.accommodations.inquire}
                  </Button>
                </CardContent>
              </Card>

              {/* Camping */}
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64">
                  <img 
                    src="/src/assets/glamping_2.jpg" 
                    alt="Camping Zone" 
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-orange-600">
                    Adventure
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t.accommodations.camping.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t.accommodations.camping.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {t.accommodations.camping.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 text-green-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => scrollToSection('contact')}
                  >
                    {t.accommodations.inquire}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section id="facilities" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t.facilities.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Coffee className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t.facilities.restaurant.title}
                </h3>
                <p className="text-gray-600">
                  {t.facilities.restaurant.description}
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Waves className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t.facilities.pool.title}
                </h3>
                <p className="text-gray-600">
                  {t.facilities.pool.description}
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t.facilities.spa.title}
                </h3>
                <p className="text-gray-600">
                  {t.facilities.spa.description}
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Mountain className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t.facilities.activities.title}
                </h3>
                <p className="text-gray-600">
                  {t.facilities.activities.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t.gallery.title}
              </h2>
              <p className="text-lg text-gray-600">
                {t.gallery.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div key={num} className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img 
                    src={`/src/assets/gallery_${num}.jpg`} 
                    alt={`Gallery ${num}`} 
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t.contact.title}
              </h2>
              <p className="text-lg text-gray-600">
                {t.contact.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Methods */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h3>
                
                <div className="space-y-4 mb-8">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
                    size="lg"
                  >
                    <Facebook className="h-5 w-5 mr-3" />
                    {t.contact.facebook}
                  </Button>
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white justify-start"
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    {t.contact.whatsapp}
                  </Button>
                  
                  <Button 
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white justify-start"
                    size="lg"
                  >
                    <Mail className="h-5 w-5 mr-3" />
                    {t.contact.email}
                  </Button>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-600">{t.contact.info.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-600">{t.contact.info.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-600">{t.contact.info.email}</span>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder={t.contact.form.name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder={t.contact.form.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder={t.contact.form.subject}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={4}
                      placeholder={t.contact.form.message}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {t.contact.form.send}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src="/src/assets/kanghan_valley_logo.png" 
                    alt="Kanghan Valley Logo" 
                    className="h-8 w-8"
                  />
                  <span className="text-xl font-bold">Kanghan Valley</span>
                </div>
                <p className="text-gray-400">
                  Your sanctuary in nature's embrace. Experience luxury and adventure in the heart of pristine nature.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                <div className="space-y-2">
                  <button onClick={() => scrollToSection('about')} className="block text-gray-400 hover:text-white transition-colors">
                    {t.nav.about}
                  </button>
                  <button onClick={() => scrollToSection('accommodations')} className="block text-gray-400 hover:text-white transition-colors">
                    {t.nav.accommodations}
                  </button>
                  <button onClick={() => scrollToSection('facilities')} className="block text-gray-400 hover:text-white transition-colors">
                    {t.nav.facilities}
                  </button>
                  <button onClick={() => scrollToSection('contact')} className="block text-gray-400 hover:text-white transition-colors">
                    {t.nav.contact}
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-bold mb-4">Contact Info</h4>
                <div className="space-y-2 text-gray-400">
                  <p>{t.contact.info.address}</p>
                  <p>{t.contact.info.phone}</p>
                  <p>{t.contact.info.email}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Kanghan Valley Resort & Camping. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </LanguageContext.Provider>
  );
}

export default App;

