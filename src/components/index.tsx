import React from "react";

export function FormGroup(props: React.HtmlHTMLAttributes<HTMLDivElement>) {
    return <div style={{ margin: "-1rem 0 0 -0.5rem" }} {...props} />;
}

export function FormElement(props: React.HtmlHTMLAttributes<HTMLSpanElement>) {
    return <span className="d-inline-block align-top ms-2 mt-3" {...props} />;
}