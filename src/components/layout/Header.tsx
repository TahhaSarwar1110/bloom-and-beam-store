import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Phone, Search, User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const hospitalBedCategories = [
  { name: 'Fully Electric Bed', slug: 'fully-electric-bed' },
  { name: 'Semi-Electric Bed', slug: 'semi-electric-bed' },
  { name: 'Bariatric Bed', slug: 'bariatric-bed' },
  { name: 'Burn Bed', slug: 'burn-bed' },
  { name: 'Birthing Bed', slug: 'birthing-bed' },
];

const stretcherCategories = [
  { name: 'EMS Stretcher', slug: 'ems-stretcher' },
  { name: 'ER Stretcher', slug: 'er-stretcher' },
  { name: 'Surgery Stretcher', slug: 'surgery-stretcher' },
  { name: 'Bariatric Stretcher', slug: 'bariatric-stretcher' },
  { name: 'EVAC Stretcher', slug: 'evac-stretcher' },
  { name: 'Eye Surgery Stretcher', slug: 'eye-surgery-stretcher' },
  { name: 'Birthing Stretcher', slug: 'birthing-stretcher' },
];

const accessoryCategories = [
  { name: 'Over Bed Table', slug: 'over-bed-table' },
  { name: 'Bedside Table', slug: 'bedside-table' },
  { name: 'Patient Recliner', slug: 'patient-recliner' },
  { name: 'Wheelchair', slug: 'wheelchair' },
];

const aboutBedmedLinks = [
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileHospitalBedsOpen, setIsMobileHospitalBedsOpen] = useState(false);
  const [isMobileStretchersOpen, setIsMobileStretchersOpen] = useState(false);
  const [isMobileAccessoriesOpen, setIsMobileAccessoriesOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getItemCount, setIsCartOpen } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const itemCount = getItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>Call Us: +1 469 767 8853</span>
          </div>
          <div className="hidden md:block">
            <span>Free Shipping on Orders Over $1,000</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="glass border-b">
        <div className="container flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-primary-foreground font-display font-bold text-xl">B</span>
            </div>
            <span className="font-display font-bold text-2xl text-foreground">
              BED<span className="text-primary">MED</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              className={cn(
                'relative font-medium transition-colors hover:text-primary',
                'after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full',
                location.pathname === '/' && 'text-primary after:w-full'
              )}
            >
              Home
            </Link>

            {/* Hospital Beds Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className={cn(
                      'bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent',
                      'font-medium transition-colors hover:text-primary px-0',
                      location.pathname.startsWith('/gallery/') && 'text-primary'
                    )}
                  >
                    Hospital Beds
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[220px] p-3 bg-card border rounded-lg shadow-lg">
                      <div className="space-y-1">
                      {hospitalBedCategories.map((category) => (
                          <NavigationMenuLink key={category.slug} asChild>
                            <Link
                              to={`/gallery/${category.slug}`}
                              className="block py-2 px-3 rounded-lg hover:bg-accent transition-colors text-sm font-medium hover:text-primary"
                            >
                              {category.name}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <NavigationMenuLink asChild>
                          <Link
                            to="/products?type=hospital-beds"
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            View All Products →
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Stretchers Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className={cn(
                      'bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent',
                      'font-medium transition-colors hover:text-primary px-0'
                    )}
                  >
                    Stretchers
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[220px] p-3 bg-card border rounded-lg shadow-lg">
                      <div className="space-y-1">
                        {stretcherCategories.map((category) => (
                          <NavigationMenuLink key={category.slug} asChild>
                            <Link
                              to={`/gallery/${category.slug}`}
                              className="block py-2 px-3 rounded-lg hover:bg-accent transition-colors text-sm font-medium hover:text-primary"
                            >
                              {category.name}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Accessories Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className={cn(
                      'bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent',
                      'font-medium transition-colors hover:text-primary px-0'
                    )}
                  >
                    Accessories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[220px] p-3 bg-card border rounded-lg shadow-lg">
                      <div className="space-y-1">
                        {accessoryCategories.map((category) => (
                          <NavigationMenuLink key={category.slug} asChild>
                            <Link
                              to={`/gallery/${category.slug}`}
                              className="block py-2 px-3 rounded-lg hover:bg-accent transition-colors text-sm font-medium hover:text-primary"
                            >
                              {category.name}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Parts Link */}
            <Link
              to="/parts"
              className={cn(
                'relative font-medium transition-colors hover:text-primary',
                'after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full',
                location.pathname === '/parts' && 'text-primary after:w-full'
              )}
            >
              Parts
            </Link>

            {/* Services Link */}
            <Link
              to="/services"
              className={cn(
                'relative font-medium transition-colors hover:text-primary',
                'after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full',
                location.pathname.startsWith('/services') && 'text-primary after:w-full'
              )}
            >
              Services
            </Link>

            {/* About Bedmed Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger 
                    className={cn(
                      'bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent',
                      'font-medium transition-colors hover:text-primary px-0'
                    )}
                  >
                    About Bedmed
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[180px] p-3 bg-card border rounded-lg shadow-lg">
                      <div className="space-y-1">
                        {aboutBedmedLinks.map((link) => (
                          <NavigationMenuLink key={link.path} asChild>
                            <Link
                              to={link.path}
                              className="block py-2 px-3 rounded-lg hover:bg-accent transition-colors text-sm font-medium hover:text-primary"
                            >
                              {link.name}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Search className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-2" align="end">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button type="submit" size="sm">
                    Search
                  </Button>
                </form>
              </PopoverContent>
            </Popover>
            
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Admin/User Actions */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                {isAdmin && (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin">
                      <User className="h-4 w-4 mr-2" />
                      Admin
                    </Link>
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                <Link to="/auth">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}

            <Button asChild className="hidden lg:flex btn-shine">
              <Link to="/contact">Get Quote</Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden border-t bg-card animate-fade-in">
            <div className="container py-4 flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'py-3 px-4 rounded-lg font-medium transition-colors hover:bg-accent',
                  'animate-fade-in-up',
                  location.pathname === '/' && 'bg-accent text-primary'
                )}
              >
                Home
              </Link>

              {/* Mobile Hospital Beds Accordion */}
              <div className="animate-fade-in-up" style={{ animationDelay: '50ms' }}>
                <button
                  onClick={() => setIsMobileHospitalBedsOpen(!isMobileHospitalBedsOpen)}
                  className={cn(
                    'w-full py-3 px-4 rounded-lg font-medium transition-colors hover:bg-accent flex items-center justify-between'
                  )}
                >
                  Hospital Beds
                  <ChevronDown className={cn('h-4 w-4 transition-transform', isMobileHospitalBedsOpen && 'rotate-180')} />
                </button>
                {isMobileHospitalBedsOpen && (
                  <div className="ml-4 mt-2 space-y-1 max-h-60 overflow-y-auto">
                    {hospitalBedCategories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/gallery/${category.slug}`}
                        onClick={() => { setIsMenuOpen(false); setIsMobileHospitalBedsOpen(false); }}
                        className="block py-2 px-4 text-sm rounded-lg hover:bg-accent transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Stretchers Accordion */}
              <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <button
                  onClick={() => setIsMobileStretchersOpen(!isMobileStretchersOpen)}
                  className="w-full py-3 px-4 rounded-lg font-medium transition-colors hover:bg-accent flex items-center justify-between"
                >
                  Stretchers
                  <ChevronDown className={cn('h-4 w-4 transition-transform', isMobileStretchersOpen && 'rotate-180')} />
                </button>
                {isMobileStretchersOpen && (
                  <div className="ml-4 mt-2 space-y-1">
                    {stretcherCategories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/gallery/${category.slug}`}
                        onClick={() => { setIsMenuOpen(false); setIsMobileStretchersOpen(false); }}
                        className="block py-2 px-4 text-sm rounded-lg hover:bg-accent transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Accessories Accordion */}
              <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <button
                  onClick={() => setIsMobileAccessoriesOpen(!isMobileAccessoriesOpen)}
                  className="w-full py-3 px-4 rounded-lg font-medium transition-colors hover:bg-accent flex items-center justify-between"
                >
                  Accessories
                  <ChevronDown className={cn('h-4 w-4 transition-transform', isMobileAccessoriesOpen && 'rotate-180')} />
                </button>
                {isMobileAccessoriesOpen && (
                  <div className="ml-4 mt-2 space-y-1">
                    {accessoryCategories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/gallery/${category.slug}`}
                        onClick={() => { setIsMenuOpen(false); setIsMobileAccessoriesOpen(false); }}
                        className="block py-2 px-4 text-sm rounded-lg hover:bg-accent transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Parts Link */}
              <Link
                to="/parts"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'py-3 px-4 rounded-lg font-medium transition-colors hover:bg-accent',
                  'animate-fade-in-up',
                  location.pathname === '/parts' && 'bg-accent text-primary'
                )}
                style={{ animationDelay: '200ms' }}
              >
                Parts
              </Link>

              {/* Services Link */}
              <Link
                to="/services"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'py-3 px-4 rounded-lg font-medium transition-colors hover:bg-accent',
                  'animate-fade-in-up',
                  location.pathname.startsWith('/services') && 'bg-accent text-primary'
                )}
                style={{ animationDelay: '225ms' }}
              >
                Services
              </Link>

              {/* Mobile About Bedmed Accordion */}
              <div className="animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                <button
                  onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
                  className="w-full py-3 px-4 rounded-lg font-medium transition-colors hover:bg-accent flex items-center justify-between"
                >
                  About Bedmed
                  <ChevronDown className={cn('h-4 w-4 transition-transform', isMobileAboutOpen && 'rotate-180')} />
                </button>
                {isMobileAboutOpen && (
                  <div className="ml-4 mt-2 space-y-1">
                    {aboutBedmedLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => { setIsMenuOpen(false); setIsMobileAboutOpen(false); }}
                        className="block py-2 px-4 text-sm rounded-lg hover:bg-accent transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="py-3 px-4 rounded-lg font-medium transition-colors hover:bg-accent flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Button variant="outline" onClick={() => { signOut(); setIsMenuOpen(false); }} className="mt-2">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button asChild variant="outline" className="mt-2">
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <User className="h-4 w-4 mr-2" />
                    Admin Login
                  </Link>
                </Button>
              )}
              <Button asChild className="mt-2 btn-shine">
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                  Get Quote
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export { hospitalBedCategories };
