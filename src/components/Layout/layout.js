import { Outlet } from "react-router-dom"
import { Suspense } from "react"
import Navbar from "../NavBar/NavBar"

export default function Layout() {
    return (
        <>
            <Navbar />
            <main>
                <Suspense fallback={<div>Loading...</div>}>
                    <Outlet />
                </Suspense>
            </main>
        </>
    )
}