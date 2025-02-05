"use client";
import React, { useState } from 'react';
import EmailVerification from './emailVerification';
import ResetPasswordForm from './resetPasswordForm';

const ResetPasswordPage = () => {
    const [isVerified, setIsVerified] = useState(false);

    const handleVerificationSuccess = () => {
        setIsVerified(true);
    };

    return (
        <>
            {!isVerified ? (
                <EmailVerification onSuccess={handleVerificationSuccess} />
            ) : (
                <ResetPasswordForm />
            )}
        </>
    );
};

export default ResetPasswordPage;
