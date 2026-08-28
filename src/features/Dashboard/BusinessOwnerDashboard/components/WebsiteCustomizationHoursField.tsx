import { WEEK_DAYS, type WebsiteCustomizationHoursDayFormValue, type WeekDay } from "../types";

const DAY_LABELS: Record<WeekDay, string> = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
};

type WebsiteCustomizationHoursFieldProps = {
    value: Record<WeekDay, WebsiteCustomizationHoursDayFormValue>;
    onChange: (day: WeekDay, value: WebsiteCustomizationHoursDayFormValue) => void;
};

/**
 * One row per day: a "closed" checkbox and two time inputs. Neither closed nor any
 * time filled in means that day was never configured at all — distinct from
 * explicitly closed — which the page's form-state hook turns into a stored null
 * rather than an empty {closed:false} record.
 */
const WebsiteCustomizationHoursField = ({ value, onChange }: WebsiteCustomizationHoursFieldProps) => {
    return (
        <div className="website-customization-hours-field">
            {WEEK_DAYS.map((day) => {
                const day_value = value[day];

                return (
                    <div key={day} className="website-customization-hours-row">
                        <span className="website-customization-hours-day-label">{DAY_LABELS[day]}</span>

                        <label className="business-dashboard-form-checkbox">
                            <input
                                type="checkbox"
                                checked={day_value.closed}
                                onChange={(e) => onChange(day, { ...day_value, closed: e.target.checked })}
                            />
                            <span>Closed</span>
                        </label>

                        <input
                            className="business-dashboard-form-input"
                            type="time"
                            value={day_value.open}
                            disabled={day_value.closed}
                            onChange={(e) => onChange(day, { ...day_value, open: e.target.value })}
                        />

                        <span className="website-customization-hours-separator">to</span>

                        <input
                            className="business-dashboard-form-input"
                            type="time"
                            value={day_value.close}
                            disabled={day_value.closed}
                            onChange={(e) => onChange(day, { ...day_value, close: e.target.value })}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default WebsiteCustomizationHoursField;
