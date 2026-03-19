import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";

type ExtensionsResult = Awaited<ReturnType<typeof shopify.app.extensions>>;

type ExtensionEntry = ExtensionsResult[number];

type ThemeActivation = {
    target: string;
    status?: string;
    handle: string;
    activations?: unknown[];
};

export const EXTENSION_HANDLE = "scout";

function isThemeExtensionActive(
    extensions: ExtensionEntry[],
    activationHandle: string,
): boolean {
    return extensions
        .filter((ext) => ext.type === "theme_app_extension")
        .some((ext) => {
            const activations = (ext.activations ?? []) as ThemeActivation[];

            return activations.some((act) => {
                if (act.handle !== activationHandle) return false;

                const hasActiveStatus = act.status === "active";

                const hasThemeActivations =
                    Array.isArray(act.activations) && act.activations.length > 0;

                return hasActiveStatus && hasThemeActivations;
            });
        });
}

export type ExtStatus = "loading" | "error" | "active" | "inactive";

export function useExtensionActivation() {
    const [status, setStatus] = useState<ExtStatus>("loading");
    const appBridge = useAppBridge();

    useEffect(() => {
        (async function () {
            try {
                const extensions = await appBridge.app.extensions();
                const isActive = isThemeExtensionActive(extensions, EXTENSION_HANDLE);
                setStatus(isActive ? "active" : "inactive");
            } catch (error) {
                setStatus("error");
            }
        })();
    }, [appBridge]);

    return status;
}
