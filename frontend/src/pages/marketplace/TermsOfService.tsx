import { Scale, FileCheck, AlertTriangle, CheckCircle2, Building, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function TermsOfService() {
  const lastUpdated = "October 24, 2026";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors py-12 md:py-20">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Scale className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Legal Agreement
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Rules, obligations, and standards governing the use of the Dr's Kart B2B medical marketplace and engineering service platform.
          </p>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Effective Date: {lastUpdated}
          </p>
        </div>

        {/* Quick Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">B2B Healthcare Scope</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Platform strictly for hospitals, diagnostic labs, clinics, certified distributors, and biomedical engineers.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
              <FileCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Mandatory KYC</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Seller accounts undergo business licensing and identity verification before listings go live.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Service & Support</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                On-demand maintenance and engineering bookings with transparent issue tracking.
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Acceptance and User Eligibility</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              By accessing, browsing, registering an account, booking equipment servicing, or submitting an equipment listing on <strong>Dr's Kart</strong>, you confirm that you have read, comprehended, and agreed to be legally bound by these Terms of Service. 
              Our services are available exclusively to legal entities, healthcare practitioners, hospitals, and commercial equipment traders who have the authority to enter into legally enforceable contracts under the Indian Contract Act, 1872.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                2
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Intermediary Role of Dr's Kart</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              Dr's Kart operates as an electronic intermediary marketplace platform as defined under Section 79 of the Information Technology Act, 2000. 
              We facilitate discovery, communication, and service request transmission between independent buyers, sellers, and third-party biomedical service technicians. Unless explicitly indicated in writing, Dr's Kart does not own, store, manufacture, or re-sell the listed physical medical equipment.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                3
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Equipment Listings & Seller Responsibilities</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              Sellers listing medical apparatus (including MRI, CT, X-Ray, Ultrasound, Cathlab, Ventilators, Monitors, and Laboratory devices) warrant that:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Condition Transparency
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Every device must be accurately categorized as <em>New</em>, <em>Used</em>, <em>Refurbished</em>, or <em>Spare Parts</em> with honest description of operational wear and past repairs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Ownership & Clear Title
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  The seller possesses unencumbered legal title and right to sell the machine without violating liens, hospital bank hypothecations, or OEM lease covenants.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Pricing in Indian Rupees
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  All asking prices must be specified in INR (₹), reflecting fair market appraisal and applicable Indian GST tax norms.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Location Accuracy
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  State and City must be accurately indicated via the official location selectors to support genuine on-site inspections.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                4
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Service Requests & Maintenance Bookings</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              Users requesting equipment maintenance, calibration, de-installation, or repair bookings agree to provide truthful descriptions of the fault or malfunction. 
              If selecting "Other Medical Equipment", the user must accurately specify the equipment model and manufacturer. Dr's Kart coordinates with authorized engineering providers but disclaims direct liability for on-site diagnostic verdicts made by independent field technicians.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                5
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Prohibited Conduct & Listing Policies</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              Users are strictly prohibited from engaging in any of the following:
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc list-inside">
              <li>Listing stolen, banned, unauthorized, radioactive, or bio-hazardous materials without statutory Atomic Energy Regulatory Board (AERB) clearance where mandated.</li>
              <li>Uploading fraudulent KYC documents, misleading hospital licenses, or forged identity records.</li>
              <li>Circumventing communication security to defraud or extort healthcare professionals.</li>
              <li>Publishing deceptive prices or fake serial numbers on listings.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                6
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Medical & Clinical Disclaimer</h2>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex gap-3 text-sm text-amber-900 dark:text-amber-200">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Important Notice:</strong> Dr's Kart does not offer medical advice, clinical diagnostics, treatment protocols, or pharmaceutical dispensation. Medical equipment must be deployed, calibrated, and maintained solely under the supervision of qualified healthcare practitioners and licensed biomedical specialists.
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                7
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Governing Law & Legal Jurisdiction</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              These Terms shall be governed by, interpreted, and construed in accordance with the laws of the Republic of India. Any controversy, dispute, or claim arising out of or related to these Terms or the use of Dr's Kart shall be subject to the exclusive jurisdiction of the competent courts located in Navi Mumbai / Thane, Maharashtra, India.
            </p>
          </section>

        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">Want to understand our data privacy?</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Read our comprehensive Privacy Policy to see how your information is safeguarded.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="border-emerald-600/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100">
              <Link to="/privacy-policy">Privacy Policy</Link>
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
