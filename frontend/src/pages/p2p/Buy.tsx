import { useLocation } from "react-router-dom";
import Swap from "./components/Swap";

const Buy = () => {
	const location = useLocation();
	const adDetail = location.state?.adDetail;
	return (
		<div className="w-full">
			<div className="w-full max-w-[1024px] mx-auto px-3">
				<Swap type={"buy"} adDetail={adDetail} />
			</div>
		</div>
	);
};
export default Buy;
