import { Fragment, useState } from "react";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Modal, MODAL_ID } from "~/components";
import { FORM_ID } from "./redirect-form";

type Redirect = {
    id: string;
    path: string;
    target: string;
};

type PageInfo = {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string | null;
    endCursor?: string | null;
};

type Props = {
    redirects: Redirect[];
    pageInfo: PageInfo;
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    onEdit: (redirect: Redirect) => void;
    onNextPage: () => void;
    onPreviousPage: () => void;
    loading?: boolean;
};

export function RedirectTable({
    redirects,
    pageInfo,
    selectedIds,
    onSelectionChange,
    onEdit,
    onNextPage,
    onPreviousPage,
    loading,
}: Props) {
    const deleteFetcher = useFetcher<{ success?: boolean; error?: string }>();
    const appBridge = useAppBridge();

    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const allSelected =
        redirects.length > 0 && selectedIds.length === redirects.length;
    const someSelected =
        selectedIds.length > 0 && selectedIds.length < redirects.length;

    function handleSelectAll(e: any) {
        if (e.target.checked) {
            onSelectionChange(redirects.map((r) => r.id));
        } else {
            onSelectionChange([]);
        }
    }

    function handleSelectRow(id: string, checked: boolean) {
        if (checked) {
            onSelectionChange([...selectedIds, id]);
        } else {
            onSelectionChange(selectedIds.filter((sid) => sid !== id));
        }
    }

    function handleDeleteClick(id: string) {
        setPendingDeleteId(id);
    }

    function handleConfirmDelete() {
        if (!pendingDeleteId) return;
        deleteFetcher.submit(
            { intent: "delete", id: pendingDeleteId },
            { method: "POST" },
        );
        appBridge.modal.hide(MODAL_ID);
        setPendingDeleteId(null);
    }

    const pendingRedirect = redirects.find((r) => r.id === pendingDeleteId);

    return (
        <Fragment>
            <s-table
                paginate
                hasNextPage={pageInfo.hasNextPage || undefined}
                hasPreviousPage={pageInfo.hasPreviousPage || undefined}
                onNextPage={onNextPage}
                onPreviousPage={onPreviousPage}
                loading={loading || undefined}
            >
                <s-table-header-row>
                    <s-table-header>
                        <s-checkbox
                            accessibilityLabel="Select all redirects"
                            checked={allSelected}
                            indeterminate={someSelected}
                            onChange={handleSelectAll}
                        />
                    </s-table-header>
                    <s-table-header listSlot="primary">Path</s-table-header>
                    <s-table-header listSlot="secondary">Target</s-table-header>
                    <s-table-header listSlot="secondary">Actions</s-table-header>
                </s-table-header-row>
                <s-table-body>
                    {redirects.map((redirect) => (
                        <s-table-row key={redirect.id}>
                            <s-table-cell>
                                <s-checkbox
                                    accessibilityLabel={`Select ${redirect.path}`}
                                    checked={selectedIds.includes(redirect.id)}
                                    onChange={(e: any) =>
                                        handleSelectRow(redirect.id, e.target.checked)
                                    }
                                />
                            </s-table-cell>
                            <s-table-cell>{redirect.path}</s-table-cell>
                            <s-table-cell>{redirect.target}</s-table-cell>
                            <s-table-cell>
                                <s-stack direction="inline" gap="small">
                                    <s-button
                                        accessibilityLabel="Edit"
                                        variant="auto"
                                        icon="edit"
                                        onClick={() => onEdit(redirect)}
                                        commandFor={FORM_ID}
                                        command="--toggle"
                                    />
                                    <s-button
                                        accessibilityLabel="Delete"
                                        variant="auto"
                                        icon="delete"
                                        tone="critical"
                                        onClick={() => handleDeleteClick(redirect.id)}
                                        commandFor={MODAL_ID}
                                        command="--show"
                                        loading={
                                            deleteFetcher.state !== "idle" && pendingDeleteId === redirect.id
                                        }
                                    />
                                </s-stack>
                            </s-table-cell>
                        </s-table-row>
                    ))}
                </s-table-body>
            </s-table>

            <Modal
                heading="Delete redirect?"
                body={
                    <s-stack direction="block" gap="small">
                        <s-text>
                            Are you sure you want to delete the redirect for "
                            {pendingRedirect?.path}"?
                        </s-text>
                        <s-text tone="caution">This action cannot be undone.</s-text>
                    </s-stack>
                }
                primaryAction={{
                    label: "Delete",
                    onClick: handleConfirmDelete,
                    tone: "critical",
                    loading: deleteFetcher.state !== "idle" && !!pendingDeleteId,
                }}
            />
        </Fragment>
    );
}
