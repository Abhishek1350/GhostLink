import { useNavigate, useNavigation, useSearchParams } from "react-router";
import { LogsResult } from "~/lib/link-logs.server";
import { FIX_MODAL, FixModal, MODAL_TYPE } from "./fix-modal";
import { Fragment } from "react/jsx-runtime";
import { GhostLinkLog } from "@prisma/client";
import { useState } from "react";

type Props = JSX.IntrinsicElements["s-box"] & {
    logs: LogsResult;
    hasFilters?: boolean;
};

interface SelectedLog {
    log: GhostLinkLog;
    type: MODAL_TYPE;
}

export function Table({ logs, hasFilters, ...props }: Props) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const loading = useNavigation().state === "loading";

    const [selectedLog, setSelectedLog] = useState<SelectedLog | null>(null);

    function handleNextPage() {
        if (logs?.hasNextPage && logs.page) {
            const params = new URLSearchParams(searchParams);
            params.set("page", String(logs?.page + 1));
            navigate(`?${params.toString()}`);
        }
    }

    function handlePreviousPage() {
        if (logs?.hasPreviousPage && logs.page) {
            const params = new URLSearchParams(searchParams);
            params.set("page", String(logs?.page - 1));
            navigate(`?${params.toString()}`);
        }
    }

    function handleFilters(key: string, value: string) {
        const params = new URLSearchParams(searchParams);
        params.forEach((_, k) => params.delete(k));
        params.set(key, value);
        navigate(`?${params.toString()}`);
    }

    function handleOpenModal(log: GhostLinkLog, type: MODAL_TYPE) {
        setSelectedLog({ log, type });
    }

    return (
        <s-box {...props}>
            {hasFilters || logs?.data.length ? (
                <s-stack
                    paddingBlockEnd="small"
                    paddingInlineEnd="small"
                    direction="inline"
                    gap="small"
                    justifyContent="space-between"
                >
                    <s-paragraph>
                        {logs!.data.length} of {logs!.total} links
                    </s-paragraph>
                    <s-box>
                        <s-select
                            placeholder="Status"
                            icon="status"
                            onChange={(e) => handleFilters("type", e.currentTarget.value)}
                            disabled={loading}
                        >
                            {["ALL", "PENDING", "FIXED"].map((filter) => (
                                <s-option value={filter} key={filter}>
                                    {filter}
                                </s-option>
                            ))}
                        </s-select>
                    </s-box>
                </s-stack>
            ) : null}
            {logs && logs.data.length > 0 ? (
                <Fragment>
                    <s-table
                        loading={loading}
                        paginate
                        hasNextPage={logs!.hasNextPage || undefined}
                        hasPreviousPage={logs!.hasPreviousPage || undefined}
                        onNextPage={handleNextPage}
                        onPreviousPage={handlePreviousPage}
                    >
                        <s-table-header-row>
                            <s-table-header listSlot="primary">Hits</s-table-header>
                            <s-table-header listSlot="secondary">Path</s-table-header>
                            <s-table-header listSlot="secondary">Status</s-table-header>
                            <s-table-header listSlot="secondary">Action</s-table-header>
                        </s-table-header-row>
                        <s-table-body>
                            {logs.data.map((log) => {
                                const isFixed = log.status === "FIXED";
                                const detailsButtonId = `log-details-${log.id}`;
                                return (
                                    <s-table-row
                                        key={log.id}
                                        aria-label="View details"
                                        clickDelegate={detailsButtonId}
                                    >
                                        <s-table-cell>
                                            <s-badge tone="neutral">{log.hitCount}</s-badge>
                                        </s-table-cell>

                                        <s-table-cell>
                                            <s-text type="strong">{log.path}</s-text>
                                            <s-link
                                                id={detailsButtonId}
                                                command="--show"
                                                commandFor={FIX_MODAL}
                                                onClick={() => handleOpenModal(log, "Details")}
                                            />
                                        </s-table-cell>
                                        <s-table-cell>
                                            <s-badge
                                                tone={log.status === "FIXED" ? "success" : "critical"}
                                            >
                                                {log.status}
                                            </s-badge>
                                        </s-table-cell>

                                        <s-table-cell>
                                            {isFixed ? (
                                                <s-button
                                                    variant="tertiary"
                                                    command="--show"
                                                    commandFor={FIX_MODAL}
                                                    onClick={() => handleOpenModal(log, "Details")}
                                                >
                                                    View
                                                </s-button>
                                            ) : (
                                                <s-button
                                                    variant="secondary"
                                                    icon="shield-check-mark"
                                                    command="--show"
                                                    tone="neutral"
                                                    commandFor={FIX_MODAL}
                                                    onClick={() => handleOpenModal(log, "Fix")}
                                                >
                                                    Fix
                                                </s-button>
                                            )}
                                        </s-table-cell>
                                    </s-table-row>
                                );
                            })}
                        </s-table-body>
                    </s-table>
                    <FixModal
                        log={selectedLog?.log as GhostLinkLog}
                        type={selectedLog?.type as MODAL_TYPE}
                        onAfterHide={() => setSelectedLog(null)}
                    />
                </Fragment>
            ) : (
                hasFilters && <s-text>No logs found.</s-text>
            )}
        </s-box>
    );
}
