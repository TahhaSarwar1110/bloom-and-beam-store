import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Phone, Search, User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const hospitalBedCategories = [
  { name: 'Manual Hospital Beds', slug: 'manual-hospital-beds', description: 'Traditional hand-crank operated beds for basic patient care needs' },
  { name: 'Semi-Electric Hospital Beds', slug: 'semi-electric-hospital-beds', description: 'Combination of electric head/foot controls with manual height adjustment' },
  { name: 'Fully Electric Hospital Beds', slug: 'fully-electric-hospital-beds', description: 'Complete electric controls for all bed positions and height' },
  { name: 'ICU / Critical Care Beds', slug: 'icu-critical-care-beds', description: 'Advanced beds designed for intensive care unit requirements' },
  { name: 'Low Beds (Fall Prevention)', slug: 'low-beds-fall-prevention', description: 'Ultra-low height beds to minimize fall injury risks' },
  { name: 'Bariatric Hospital Beds', slug: 'bariatric-hospital-beds', description: 'Heavy-duty beds designed for larger patients with higher weight capacity' },
  { name: 'Pediatric Hospital Beds', slug: 'pediatric-hospital-beds', description: 'Specially designed beds for infants and children' },
  { name: 'Maternity / OB-GYN Beds', slug: 'maternity-ob-gyn-beds', description: 'Specialized beds for labor, delivery, and postpartum care' },
  { name: 'Fowler Beds', slug: 'fowler-beds', description: 'Adjustable beds with backrest elevation for patient comfort' },
  { name: 'Orthopedic Hospital Beds', slug: 'orthopedic-hospital-beds', description: 'Beds with traction frames and specialized orthopedic features' },
  { name: 'Adjustable Hospital Beds', slug: 'adjustable-hospital-beds', description: 'Versatile beds with multiple positioning options' },
  { name: 'Air Therapy Beds', slug: 'air-therapy-beds', description: 'Pressure-relieving beds using air technology for wound care' },
  { name: 'Specialty Therapy Beds', slug: 'specialty-therapy-beds', description: 'Therapeutic beds for specific medical conditions' },
  { name: 'Examination Beds', slug: 'examination-beds', description: 'Beds designed for medical examinations and procedures' },
  { name: 'Recovery Beds', slug: 'recovery-beds', description: 'Post-operative recovery beds with essential monitoring features' },
  { name: 'Stretchers & Trolleys', slug: 'stretchers-trolleys', description: 'Mobile patient transport beds and emergency stretchers' },
  { name: 'Homecare Hospital Beds', slug: 'homecare-hospital-beds', description: 'Hospital-grade beds designed for home healthcare settings' },
  { name: 'Isolation Beds', slug: 'isolation-beds', description: 'Specialized beds for infectious disease isolation protocols' },
  { name: 'Psychiatric Beds', slug: 'psychiatric-beds', description: 'Safety-focused beds for mental health care facilities' },
  { name: 'Convertible / Chair Beds', slug: 'convertible-chair-beds', description: 'Multi-functional beds that convert to chair positions' },
];

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Parts', path: '/parts' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const { getItemCount, setIsCartOpen } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>24/7 Support: 1-800-BEDMED-1</span>
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
                      location.pathname.startsWith('/category/') && 'text-primary'
                    )}
                  >
                    Hospital Beds
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[600px] p-4 bg-card border rounded-lg shadow-lg">
                      <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                        {hospitalBedCategories.map((category) => (
                          <NavigationMenuLink key={category.slug} asChild>
                            <Link
                              to={`/category/${category.slug}`}
                              className="block p-3 rounded-lg hover:bg-accent transition-colors group"
                            >
                              <div className="font-medium text-sm group-hover:text-primary transition-colors">
                                {category.name}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {category.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <Link
                          to="/products"
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          View All Products →
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'relative font-medium transition-colors hover:text-primary',
                  'after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full',
                  location.pathname === link.path && 'text-primary after:w-full'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            
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
                  onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                  className={cn(
                    'w-full py-3 px-4 rounded-lg font-medium transition-colors hover:bg-accent flex items-center justify-between',
                    location.pathname.startsWith('/category/') && 'bg-accent text-primary'
                  )}
                >
                  Hospital Beds
                  <ChevronDown className={cn('h-4 w-4 transition-transform', isMobileCategoriesOpen && 'rotate-180')} />
                </button>
                {isMobileCategoriesOpen && (
                  <div className="ml-4 mt-2 space-y-1 max-h-60 overflow-y-auto">
                    {hospitalBedCategories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/category/${category.slug}`}
                        onClick={() => { setIsMenuOpen(false); setIsMobileCategoriesOpen(false); }}
                        className="block py-2 px-4 text-sm rounded-lg hover:bg-accent transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                    <Link
                      to="/products"
                      onClick={() => { setIsMenuOpen(false); setIsMobileCategoriesOpen(false); }}
                      className="block py-2 px-4 text-sm text-primary font-medium rounded-lg hover:bg-accent transition-colors"
                    >
                      View All Products →
                    </Link>
                  </div>
                )}
              </div>

              {navLinks.slice(1).map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'py-3 px-4 rounded-lg font-medium transition-colors hover:bg-accent',
                    'animate-fade-in-up',
                    location.pathname === link.path && 'bg-accent text-primary'
                  )}
                  style={{ animationDelay: `${(index + 2) * 50}ms` }}
                >
                  {link.name}
                </Link>
              ))}
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
