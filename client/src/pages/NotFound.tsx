import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-4 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Compass className="size-5" aria-hidden="true" />
      </span>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          Page not found
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          The page you're looking for doesn't exist or has moved.
        </p>
      </div>
      <Link
        to="/"
        className="mt-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
      >
        Back to your board
      </Link>
    </div>
  );
};

export default NotFound;
