import Link from "next/link";
import { Brain, Home } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
            <Card variant="glass" className="max-w-md w-full text-center">
                <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
                <p className="text-gray-400 mb-6">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link href="/dashboard">
                    <Button variant="gradient">
                        <Home className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>
            </Card>
        </div>
    );
}
