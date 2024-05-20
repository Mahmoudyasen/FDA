import Docy from "@/-components/Docy";
import DoctorsList from "./DoctorsList";

export default function Home() {
    return (
        <div className="grid grid-cols-4" style={{ columnGap: '0' }}>
            <div className="col-span-1"><DoctorsList/></div>
            <div className="col-span-3">
                <Docy/>
            </div>
        </div>
    );
}
