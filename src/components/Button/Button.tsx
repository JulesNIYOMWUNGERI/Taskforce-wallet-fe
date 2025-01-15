interface ButtonProps {
  value?: string;
  styling?: string;
  icon?: string;
  onClick?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  LoaderStyle?: string;
}

export default function Button({
  value,
  styling,
  icon,
  onClick,
  isLoading,
  isDisabled,
  LoaderStyle,
}: ButtonProps) {
  return (
    <button
      type="submit"
      className={`${styling} ${
        isDisabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={onClick}
      disabled={isDisabled}
    >
      <div className="flex items-center justify-center">
        {isLoading ? (
          <div
            className={
              LoaderStyle
                ? LoaderStyle
                : "animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"
            }
          ></div>
        ) : (
          <>
            {icon && (
              <img
                className="mr-[10px]"
                alt="icon"
                src={icon}
                width={25}
                height={25}
              />
            )}
            <div className="">{value}</div>
          </>
        )}
      </div>
    </button>
  );
}
