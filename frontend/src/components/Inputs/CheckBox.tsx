import { InputHTMLAttributes, forwardRef } from "react";
interface IInputCheckProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const InputCheck = forwardRef<HTMLInputElement, IInputCheckProps>(
  ({ id, label, error, className, ...props }, ref) => {
    return (
      <div className={`relative  ${className}`}>
        <div className={`flex items-center gap-2 `}>
          <div className="checkbox-container-bisat">
            <input
              id="custom-checkbox-bisat"
              className="checkbox-input-bisat"
              type={props.type ? props.type : "checkbox"}
              onChange={props.onChange}
              {...props}
            />
            <label
              htmlFor="custom-checkbox-bisat"
              className="checkbox-label-bisat"
            ></label>
          </div>
        </div>

        {error && (
          <small className="text-xs absolute w-full text-red-500 text-nowrap">
            {error}
          </small>
        )}
      </div>
    );
  }
);

InputCheck.displayName = "InputCheck";
