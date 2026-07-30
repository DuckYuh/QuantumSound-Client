"use client";

import { Input, Button } from '@/components/ui';
import { useState } from 'react';
import { userService } from '@/services/user.service';
import { toast } from 'sonner';

export default function PasswordSection() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleUpdatePassword() {
    setLoading(true);
    try {
      if (newPassword !== confirmPassword) {
        console.error('New password and confirm password do not match');
        return;
      }
      await userService.updatePassword({
        oldPassword,
        newPassword
      });
      toast.success("Password changed successfully.");
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error("Failed to update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div>Password Section</div>
      <div className="mt-4 space-y-2">
        <label className="text-sm font-medium">
          Current Password
        </label>
        <Input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <label className="text-sm font-medium">
          New Password
        </label>
        <Input
          type="password"
          value={newPassword}   
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label className="text-sm font-medium">
          Confirm Password
        </label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <Button onClick={handleUpdatePassword}>
          Update Password
        </Button>
      </div>
    </div>
  );
}