interface InputProps {
  value?: string;
  label?: string;
  placeholder?: string;
  type?: string;
  name?: string;
  icon?: string;
  dollarIcon?: string;
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  container?: {
    className?: string;
  };
  inputlabel?: {
    className?: string;
  };
  input?: {
    className?: string;
  };
  min?: number;
  max?: number;
}

export default function InputField({
  value,
  label,
  placeholder,
  required,
  type,
  name,
  icon,
  min,
  max,
  dollarIcon,
  onInput,
  onChange,
  onBlur,
  className,
  ...props
}: InputProps) {
  return (
    <div className={`${props.container?.className} ${className}`}>
      {label && required ? (
        <label
          className={props.inputlabel?.className}
          htmlFor="app-input-field"
        >
          {label} <span className="text-red-500">*</span>
        </label>
      ) : (
        <label
          className={props.inputlabel?.className}
          htmlFor="app-input-field"
        >
          {label}
        </label>
      )}
      <div className="absolute ml-3 mt-[2.6rem]">
        {icon ? <img alt="icon" src={icon} width={26} height={26} /> : ""}
      </div>

      <div className="absolute right-10 mt-[36px]">
        {dollarIcon ? (
          <img alt="icon" src={dollarIcon} width={26} height={26} />
        ) : (
          ""
        )}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        min={min}
        max={max}
        onInput={onInput}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        className={props.input?.className}
        {...props}
      />
    </div>
  );
};
