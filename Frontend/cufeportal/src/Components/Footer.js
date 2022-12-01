// TODO Complete the Footer, Add socials
export default function Footer() {
    const now = new Date();
    return (
        <footer className="footer">
            <p className="footer-text">Developed by Omar Shebl - EEE23, {now.getFullYear()}</p>
        </footer>
    )
}