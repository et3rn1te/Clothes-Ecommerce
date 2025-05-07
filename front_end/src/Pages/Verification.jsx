const VerificationPage = ({ email, onResend }) => {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-900">Verify your email</h2>
      <p className="text-gray-600">We have sent a verification link to</p>
      <p className="font-medium text-gray-800">{email}</p>
      <p className="text-gray-600">Please check your inbox and click the link to verify your account</p>
      <div className="pt-4">
        <button
          onClick={onResend}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Resend verification email
        </button>
      </div>
    </div>
  );
};

export default VerificationPage;