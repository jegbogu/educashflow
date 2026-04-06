import RootLayout from "@/components/layout";

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-gray-700 leading-relaxed">

      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
        DISCLAIMER FOR EDUQUIZZ GLOBAL LIMITED
      </h1>

      <p className="mb-8 text-lg">
        Eduquizz Global Limited is an online education platform designed to
        provide users with structured quizzes, learning activities, and
        reward-based engagement. By accessing and using this platform, you
        agree to the terms outlined in this disclaimer.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          Educational Purpose Only
        </h2>
        <p>
          All content, quizzes, and materials provided on Eduquizz Global
          Limited are for educational and informational purposes only. While
          efforts are made to ensure accuracy, the platform does not guarantee
          that all information is complete, current, or error-free.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          No Professional Advice
        </h2>
        <p>
          The platform does not provide professional, legal, financial, or
          academic certification advice. Users are encouraged to consult
          qualified professionals where necessary.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          User Responsibility
        </h2>
        <p>
          Participation in quizzes and reward systems is voluntary. Users are
          solely responsible for how they interpret and use the information
          obtained from the platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          Rewards and Incentives
        </h2>
        <p>
          Eduquizz Global Limited may offer rewards, incentives, or recognition
          based on user performance. These rewards are subject to specific
          terms and conditions and may be modified, suspended, or withdrawn at
          any time without prior notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          Third-Party Services
        </h2>
        <p>
          The platform may integrate with third-party services, including
          payment processors or external links. Eduquizz Global Limited is not
          responsible for the accuracy, security, or practices of these third
          parties.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          Limitation of Liability
        </h2>
        <p>
          Eduquizz Global Limited shall not be held liable for any direct,
          indirect, incidental, or consequential damages arising from the use
          or inability to use the platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          Changes to Content and Terms
        </h2>
        <p>
          The company reserves the right to update, modify, or remove any
          content, features, or terms of this disclaimer at any time without
          prior notice.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          Acceptance of Terms
        </h2>
        <p>
          By using Eduquizz Global Limited, you acknowledge that you have read,
          understood, and agreed to this disclaimer.
        </p>
      </section>

      <footer className="border-t pt-6 text-sm text-white p-5">
        <strong className="text-white">Eduquizz Global Limited</strong>
        <p className="mt-3">Promoting knowledge through interactive learning and rewards.</p>
      </footer>
    </div>
  );
}

DisclaimerPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};