import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
    user?: { name: string };
}

export default function Layout({ children, user }: LayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header user={user}/>
            <main className="min-h-[100vh]">
                {children}
            </main>
            <Footer />
        </div>
    );
}
