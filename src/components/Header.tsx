import React from "react";

type Props = {};

const Header = (props: Props) => {
  return (
    <div className="sticky top-0 bg-white flex flex-row gap-2 items-center w-full text-xl p-4 border-b-2">
      <h1 className="text-3xl font-bold text-center">Briefly</h1>
      <p className="self-end text-sm">
        Stay up to date, get your summarized news today
      </p>
    </div>
  );
};

export default Header;
