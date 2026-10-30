import { ShieldCheck, Lock, Eye, CheckCircle2, Mail, Phone, MapPin, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function PrivacyPolicy() {
  const lastUpdated = "October 24, 2026";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors py-12 md:py-20">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Legal & Trust Center
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Learn how Dr's Kart protects, processes, and respects your personal and healthcare enterprise data.
          </p>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Quick Trust Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Bank-Grade Encryption</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                All data transmission is protected with modern TLS/SSL cryptographic protocols.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
              <Eye className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Zero Data Resale</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                We never monetize or sell your healthcare facility details or contact data to third-party ad brokers.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Verified B2B Community</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                KYC and hospital credential audits preserve platform security and legitimate equipment trades.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 sm:p-12 space-y-10">
          
          {/* Section 1 */}
          <section className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                1
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Introduction & Platform Purpose</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              Welcome to <strong>Dr's Kart</strong> ("we", "us", or "our"), India's dedicated B2B medical equipment marketplace operated to connect hospitals, clinics, diagnostic imaging centers, biomedical engineers, and authorized healthcare equipment vendors. 
              This Privacy Policy explains how we collect, store, utilize, disclose, and safeguard your personal information when you access our web application, search listings, communicate via our messaging portal, book service repairs, or publish equipment offerings.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                2
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Information We Collect</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              We collect information to deliver a trusted, reliable, and compliant experience. The categories of data we gather include:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Account & Profile Data
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Name, phone number, email address, system-generated username, medical specialty or profession, hospital or clinic name, and regional location.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> KYC & Verification Records
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Medical establishment licenses, GST registration certificates, company identity proofs, or Aadhaar/PAN cards necessary to approve verified Seller privileges.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Equipment & Service Data
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Listing descriptions, photos, videos, specifications, pricing, service repair requests, maintenance history, and communication chats between buyers and sellers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Security & Audit Logs
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  IP addresses, login timestamps, OTP verification records, browser user-agent tokens, and security alert triggers to defend against unauthorized logins.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                3
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How We Use Your Information</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              Your details are exclusively utilized for legitimate platform operations:
            </p>
            <ul className="space-y-2.5 text-sm md:text-base text-slate-600 dark:text-slate-300 list-disc list-inside">
              <li><strong>Marketplace Facilitation:</strong> Enabling prospective hospital buyers to contact equipment owners and negotiate deals.</li>
              <li><strong>Certified Engineering Services:</strong> Connecting your repair requests with qualified biomedical technicians for inspections and calibrations.</li>
              <li><strong>Fraud Mitigation:</strong> Verifying equipment provenance, confirming seller identity, and monitoring suspicious activity.</li>
              <li><strong>Notifications & Updates:</strong> Providing OTP codes, inquiry lead alerts, and real-time support ticket resolution notices.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                4
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Data Sharing and Disclosure</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              We never sell or lease user data. Disclosures occur solely in the following controlled circumstances:
            </p>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>• <strong>Transaction Counter-parties:</strong> When a buyer initiates an inquiry or chat on an equipment listing, relevant business contact details are visible to facilitate deal closing.</p>
              <p>• <strong>Service Engineers:</strong> When you book a service request, equipment location and contact numbers are provided to the designated technician to coordinate on-site visitations.</p>
              <p>• <strong>Legal Compliance:</strong> If mandated by Indian law, judicial decree, or law enforcement investigations under the Information Technology Act, 2000 and Digital Personal Data Protection Act (DPDPA).</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                5
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Security & Retention</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              We apply comprehensive technical and administrative defenses, including cryptographic hashing of one-time passwords (OTPs), automated rate-limiting, and PostgreSQL row-level security. We retain account records as long as your account remains active or as required by Indian commercial tax and medical equipment accountability regulations.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                6
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Privacy Rights</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              As an authenticated user, you have the right to inspect your profile data, update company credentials, export your listings, or request account closure and data anonymization by contacting our support desk.
            </p>
          </section>

          {/* Section 7 - Grievance Officer */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                7
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Grievance Redressal & Contact</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              In accordance with the Information Technology Act, 2000 and rules made thereunder, questions or grievances concerning data handling may be escalated to our designated Grievance Officer:
            </p>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <p className="font-bold text-slate-900 dark:text-white">Dr's Kart Privacy & Grievance Cell</p>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span>Email: <a href="mailto:infodrskart@gmail.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">infodrskart@gmail.com</a></span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span>Helpline: +91 90282 33934</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <MapPin className="h-4 w-4 text-emerald-500" />
                <span>Registered Address: Sector 6, Ghansoli, Navi Mumbai, Maharashtra - 400701, India</span>
              </div>
            </div>
          </section>

        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">Have questions about our terms?</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Read our complete Terms of Service or consult our support team.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="border-emerald-600/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100">
              <Link to="/terms-of-service">Terms of Service</Link>
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
