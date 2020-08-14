export default function Layout({preview, children}) {
    return (
        <div className="font-sans">
            <main>{children}</main>
        </div>
    )
}