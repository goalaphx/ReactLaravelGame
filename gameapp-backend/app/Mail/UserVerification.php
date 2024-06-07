<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class UserVerification extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $verificationUrl;

    public function __construct(User $user)
    {
        $this->user = $user;
        $this->verificationUrl = $this->generateVerificationUrl();
    }

    public function build()
    {
        return $this->view('emails.user-verification');
    }

    private function generateVerificationUrl()
    {
        // Access the frontend URL from the environment configuration
        $frontendUrl = env('FRONTEND_URL');
        
        // Generate the verification URL using the frontend URL and the verification token
        return $frontendUrl . '/verify-email?token=' . $this->user->verification_token;
    }
}
