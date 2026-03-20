type Props = JSX.IntrinsicElements["s-modal"] & {
    body: JSX.Element;
    primaryAction: {
        label: string;
        onClick: () => void;
        tone?: "auto" | "critical" | "neutral";
        loading?: boolean;
    };
    secondaryActionLabel?: string;
};

export const MODAL_ID = "modal";

export function Modal({
    body,
    primaryAction,
    secondaryActionLabel,
    ...props
}: Props) {
    return (
        <s-modal id={MODAL_ID} heading="Are you sure?" {...props}>
            {body}
            <s-button
                slot="primary-action"
                variant="primary"
                tone={primaryAction.tone || "auto"}
                loading={primaryAction.loading}
                onClick={primaryAction.onClick}
            >
                {primaryAction.label}
            </s-button>
            <s-button
                slot="secondary-actions"
                variant="secondary"
                commandFor={props?.id || MODAL_ID}
                command="--hide"
            >
                {secondaryActionLabel ?? "Cancel"}
            </s-button>
        </s-modal>
    );
}
