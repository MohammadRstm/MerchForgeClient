import { useState } from "react";
import useDebounce from "../../../../../hooks/useDebounce";
import { DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "../../constants";
import type { AuditEventType, AuditLogQueryParams } from "../../types";

const useAuditLogTableState = () => {
    const [actorInput, setActorInput] = useState("");
    const [eventType, setEventType] = useState<AuditEventType | undefined>(undefined);
    const [success, setSuccess] = useState<boolean | undefined>(undefined);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [page, setPage] = useState(1);

    const debouncedActor = useDebounce({ value: actorInput, debounceTimeMs: SEARCH_DEBOUNCE_MS });

    const query: AuditLogQueryParams = {
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        actor: debouncedActor.trim() || undefined,
        eventType,
        success,
        from: fromDate ? new Date(`${fromDate}T00:00:00`).toISOString() : undefined,
        to: toDate ? new Date(`${toDate}T23:59:59`).toISOString() : undefined,
    };

    const handleActorChange = (value: string) => {
        setActorInput(value);
        setPage(1);
    };

    const handleEventTypeChange = (value: AuditEventType | undefined) => {
        setEventType(value);
        setPage(1);
    };

    const handleSuccessChange = (value: boolean | undefined) => {
        setSuccess(value);
        setPage(1);
    };

    const handleFromDateChange = (value: string) => {
        setFromDate(value);
        setPage(1);
    };

    const handleToDateChange = (value: string) => {
        setToDate(value);
        setPage(1);
    };

    const clearFilters = () => {
        setActorInput("");
        setEventType(undefined);
        setSuccess(undefined);
        setFromDate("");
        setToDate("");
        setPage(1);
    };

    const hasActiveFilters = !!(actorInput || eventType || success !== undefined || fromDate || toDate);

    return {
        query,
        actorInput,
        eventType,
        success,
        fromDate,
        toDate,
        hasActiveFilters,

        handleActorChange,
        handleEventTypeChange,
        handleSuccessChange,
        handleFromDateChange,
        handleToDateChange,
        clearFilters,
        setPage,
    };
};

export default useAuditLogTableState;
