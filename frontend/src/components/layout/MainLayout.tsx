import { Outlet, Link } from "react-router-dom";
import { TopNavbar } from "./TopNavbar";
import logoDarkImg from "@/assets/logo_dark.png";
import { Mail, Phone, MapPin } from "lucide-react";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <TopNavbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 mt-auto border-t border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            
            {/* Brand Information - 3 Cols */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center gap-2">
                <Link to="/">
                  <img src={logoDarkImg} alt="Dr's Kart Logo" className="h-10 w-auto" />
                </Link>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                India's trusted B2B healthcare equipment marketplace connecting hospitals, clinics, diagnostic centers, and certified biomedical engineers.
              </p>
              <div className="pt-2 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                  <a href="mailto:infodrskart@gmail.com" className="hover:text-emerald-400 transition-colors">infodrskart@gmail.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>+91 90282 33934</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Sector 6, Ghansoli, Navi Mumbai, Maharashtra - 400701</span>
                </div>
              </div>
            </div>

            {/* For Buyers - 2 Cols */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-white font-bold text-base tracking-wide">For Buyers</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/dashboard/chat" className="hover:text-emerald-400 transition-colors block">
                    Chat
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/services" className="hover:text-emerald-400 transition-colors block">
                    Book a Service
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/tickets" className="hover:text-emerald-400 transition-colors block">
                    Support Tickets
                  </Link>
                </li>
                <li>
                  <Link to="/search" className="hover:text-emerald-400 transition-colors block">
                    Browse Marketplace
                  </Link>
                </li>
              </ul>
            </div>

            {/* Equipment Categories - 3 Cols */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-white font-bold text-base tracking-wide">Equipment Categories</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                <ul className="space-y-2.5">
                  <li>
                    <Link to="/search?category=MRI" className="hover:text-emerald-400 transition-colors block">
                      MRI
                    </Link>
                  </li>
                  <li>
                    <Link to="/search?category=CT%20Scan" className="hover:text-emerald-400 transition-colors block">
                      CT Scan
                    </Link>
                  </li>
                  <li>
                    <Link to="/search?category=Ultrasound" className="hover:text-emerald-400 transition-colors block">
                      Ultrasound
                    </Link>
                  </li>
                  <li>
                    <Link to="/search?category=X-Ray" className="hover:text-emerald-400 transition-colors block">
                      X-Ray
                    </Link>
                  </li>
                  <li>
                    <Link to="/search?category=Cathlab" className="hover:text-emerald-400 transition-colors block">
                      Cathlab
                    </Link>
                  </li>
                  <li>
                    <Link to="/search?category=ECG" className="hover:text-emerald-400 transition-colors block">
                      ECG
                    </Link>
                  </li>
                </ul>

                <ul className="space-y-2.5">
                  <li>
                    <Link to="/search?category=Ventilator" className="hover:text-emerald-400 transition-colors block">
                      Ventilator
                    </Link>
                  </li>
                  <li>
                    <Link to="/search?category=Patient%20Monitor" className="hover:text-emerald-400 transition-colors block">
                      Patient Monitor
                    </Link>
                  </li>
                  <li>
                    <Link to="/search?category=Defibrillator" className="hover:text-emerald-400 transition-colors block">
                      Defibrillator
                    </Link>
                  </li>
                  <li>
                    <Link to="/search?category=Laboratory%20Equipment" className="hover:text-emerald-400 transition-colors block">
                      Laboratory Equipment
                    </Link>
                  </li>
                  <li>
                    <Link to="/search?category=Surgical%20Equipment" className="hover:text-emerald-400 transition-colors block">
                      Surgical Equipment
                    </Link>
                  </li>
                  <li>
                    <Link to="/search?category=Other" className="hover:text-emerald-400 transition-colors block">
                      Other Equipment
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* For Sellers - 2 Cols */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-white font-bold text-base tracking-wide">For Sellers</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/kyc" className="hover:text-emerald-400 transition-colors block">Start Selling (KYC)</Link></li>
                <li><Link to="/sell" className="hover:text-emerald-400 transition-colors block">List New Equipment</Link></li>
                <li><Link to="/dashboard/listings" className="hover:text-emerald-400 transition-colors block">My Listings</Link></li>
                <li><Link to="/dashboard/inquiries" className="hover:text-emerald-400 transition-colors block">Manage Inquiries</Link></li>
                <li><Link to="/dashboard/promotions" className="hover:text-emerald-400 transition-colors block">Seller Promotions</Link></li>
              </ul>
            </div>

            {/* Support & Company - 2 Cols */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-white font-bold text-base tracking-wide">Company & Legal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/about" className="hover:text-emerald-400 transition-colors block">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-emerald-400 transition-colors block">Contact Support</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors block font-medium text-slate-300">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-emerald-400 transition-colors block font-medium text-slate-300">Terms of Service</Link></li>
                <li><Link to="/search" className="hover:text-emerald-400 transition-colors block">Search Equipment</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <span>&copy; {new Date().getFullYear()} Dr's Kart Marketplace. All rights reserved.</span>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-slate-500 text-xs">
              <span>Made for India's Healthcare Ecosystem</span>
              <span className="hidden sm:inline text-slate-800">|</span>
              <span>
                Designed & Developed By{" "}
                <a
                  href="https://www.azyntrex.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
                >
                  Azyntrex Tech Services Pvt Ltd
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
