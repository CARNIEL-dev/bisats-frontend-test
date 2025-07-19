import { InputHTMLAttributes, forwardRef } from "react";
interface IInputCheckProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const InputCheck = forwardRef<HTMLInputElement, IInputCheckProps>(
  ({ id, label, error, className, ...props }, ref) => {
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        <div className={`flex items-center space-x-2 font-grotesk`}>
          <div className="checkbox-container">
            <input
              ref={ref}
              id="custom-checkbox"
              type={props.type ? props.type : "checkbox"}
              className={``}
              {...props}
            />
            <label htmlFor="custom-checkbox" className="checkbox-label"></label>
          </div>

          {error && (
            <small className="text-xs text-error transition-all duration-300">
              {error}
            </small>
          )}
        </div>
      </div>
    );
  }
);
