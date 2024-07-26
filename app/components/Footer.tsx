export default function Footer() {
    return (
      <footer className="text-primary p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
        </div>
      </footer>
    );
  }
  