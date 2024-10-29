declare module "*.svg" {
    import * as React from "react";
    const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export { ReactComponent };
    export default ReactComponent;
}