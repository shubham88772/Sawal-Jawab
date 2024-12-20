import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  loginData: { email: string; password: string };
  setLoginData: (data: { email: string; password: string }) => void;
  handleLogin: () => void;
  loginError: string | null;
}

export default function Login({
  showModal,
  setShowModal,
  loginData,
  setLoginData,
  handleLogin,
  loginError,
}: LoginProps) {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button variant="outline">Login</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
          </div>
          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
