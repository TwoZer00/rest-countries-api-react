import FlagTransition from "./FlagTransition";

export default function RandomFlag({ flag }) {
  return (
    <div className="w-[500px] h-[250px] overflow-hidden">
      <FlagTransition key={flag.ccn3} flag={flag} />
    </div>
  );
}
