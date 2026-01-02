export function Footer() {
  return (
    <footer className="border-t border-base-300 py-6">
      <p className="text-center text-sm text-base-content/60">
        © {new Date().getFullYear()}
      </p>
    </footer>
  );
}
