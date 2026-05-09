import RootLayout from "@/components/layout";
import GeneralHeadMeta from "@/components/home/generalheadmeta";

export default function DisclaimerPage() {
  return (
    <>
     <GeneralHeadMeta/>
    <div className="max-w-5xl mx-auto px-6 py-16 text-gray-700 leading-relaxed">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          EDUQUIZZ GLOBAL LIMITED
        </h1>
        <p className="text-lg text-gray-600">
          Policy Statement, Terms & Conditions of Payment and Reward System
        </p>
        <p> <a href="/DISCLAIMER" target="_blank" className="text-red-800 mt-5 font-bold">Read our DISCLAIMER</a></p>
      </div>

      <Section title="1. Introduction">
        Eduquizz Global Limited is an EduTech quiz-based engagement platform that monetizes knowledge through structured quizzes while rewarding users based on participation and performance.
        <br /><br />
        The platform operates using a point-based quiz system, structured difficulty levels, and coupon access packs that enable users to participate in quizzes and earn rewards.
      </Section>

      <Section title="2. Objectives">
        <ul className="list-disc pl-6 space-y-1">
          <li>Promote learning through structured quiz activities</li>
          <li>Monetize knowledge and intellectual skills</li>
          <li>Provide interactive and gamified learning experiences</li>
          <li>Enable performance tracking and analytics</li>
          <li>Support flexible and accessible learning</li>
          <li>Build a global learning community</li>
          <li>Encourage continuous learning and skill development</li>
          <li>Promote high-quality educational content</li>
          <li>Offer certification and recognition</li>
          <li>Ensure data security and fair assessment</li>
        </ul>
      </Section>

      <Section title="3. Quiz Structure & Game Mechanics">
        <ul className="list-disc pl-6 space-y-1">
          <li>Levels: Beginner, Intermediate, Advanced</li>
          <li>10 questions per quiz</li>
          <li>12 seconds per question</li>
          <li>5 base points per question</li>
        </ul>

        <h4 className="font-semibold mt-4">Bonus Points:</h4>
        <ul className="list-disc pl-6">
          <li>Beginner – 0 extra points</li>
          <li>Intermediate – +1 points</li>
          <li>Advanced – +2 points</li>
        </ul>
      </Section>

      <Section title="4. Point & Reward System">
        <p className="mb-2">
          Each point earned equals <strong>0.02 IN Naira CURRENCY and 0.0000146 IN Dollar CURRENCY</strong>.
        </p>
        <ul className="list-disc pl-6">
          <li>Bronze – 10 points (2x earning)</li>
          <li>Silver – 20 points (4x earning)</li>
          <li>Gold/Pro – 40 points (8x earning)</li>
        </ul>
      </Section>

      <Section title="5. Coupon Access Plans">
        <div className="grid md:grid-cols-3 gap-6 mt-4">
          <PlanCard
            title="Bronze"
            price="$5 / ₦500"
            features={[
              "10 quiz attempts",
              "Valid for 7 days",
              "2x earning rate",
              "Email support"
            ]}
          />
          <PlanCard
            title="Silver (Popular)"
            price="$10 / ₦1000"
            features={[
              "25 quiz attempts",
              "Valid for 14 days",
              "4x earning rate",
              "Priority support",
              "Bonus challenges"
            ]}
          />
          <PlanCard
            title="Gold"
            price="$20 / ₦2000"
            features={[
              "50 quiz attempts",
              "Valid for 30 days",
              "6x earning rate",
              "VIP support",
              "Exclusive quizzes",
              "Weekly bonuses"
            ]}
          />
        </div>
      </Section>

      <Section title="6. Withdrawal Policy">
        <ul className="list-disc pl-6">
          <li>Minimum balance: $3 / ₦1500</li>
          <li>Minimum withdrawal: $1 / ₦1000</li>
          <li>Maximum withdrawal: $10 / ₦5000</li>
          <li>All withdrawals are subject to verification</li>
        </ul>
      </Section>

      <Section title="7. Payment Policy">
        <ul className="list-disc pl-6">
          <li>Processed twice daily</li>
          <li>Completed within 24–72 hours</li>
          <li>Delays may occur due to technical issues</li>
          <li>Users must provide accurate payment details</li>
        </ul>
      </Section>

      <Section title="8. Participation Policy">
        <ul className="list-disc pl-6">
          <li>Each coupon grants quiz access</li>
          <li>Extra attempts require new coupons</li>
          <li>Limits depend on selected plan</li>
          <li>Abuse may lead to disqualification</li>
        </ul>
      </Section>

      <Section title="9. Anti-Fraud Policy">
        <ul className="list-disc pl-6">
          <li>No multiple accounts</li>
          <li>No bots or automation</li>
          <li>No manipulation of results</li>
          <li>No exploitation of reward system</li>
        </ul>
        <p className="mt-2">
          Violations may result in suspension, loss of rewards, or legal action.
        </p>
      </Section>

      <Section title="10. Refund Policy">
        <p>
          Coupon purchases are non-refundable except for failed transactions or verified system errors.
          Approved refunds are processed within 5–7 working days.
        </p>
      </Section>

      <Section title="11. Data Protection">
        Eduquizz complies with NDPR. User data is processed lawfully and not shared without consent unless required by law.
      </Section>

      <Section title="12. Governing Law">
        Governed by the Laws of the Federal Republic of Nigeria. KYC verification may be required before withdrawals.
      </Section>

      <Section title="13. Dispute Resolution">
        Disputes will first be resolved amicably. If unresolved, they will be handled in Nigerian courts.
      </Section>

      <Section title="14. Contact Information">
        <p><strong>Phone:</strong> +2348039420442, +2348068220921</p>
        <p><strong>Email:</strong> eduquizz5457@gmail.com</p>
      </Section>

      <Section title="15. Acknowledgement">
        By participating, users confirm they have read and agreed to these terms.
      </Section>

    </div>
    </>
  );
}

/* Reusable Section Component */
function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b pb-2">
        {title}
      </h2>
      <div className="text-gray-700">{children}</div>
    </section>
  );
}

/* Plan Card Component */
function PlanCard({ title, price, features }) {
  return (
    <div className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-xl font-semibold text-blue-600 mb-4">{price}</p>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    </div>
  );
}

/* Layout wrapper */
DisclaimerPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};