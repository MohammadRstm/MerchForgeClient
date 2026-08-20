import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { AssignableBusinessRole, BusinessMemberResponse } from "../types";

type MembersTableProps = {
    members?: BusinessMemberResponse[];
    isLoading: boolean;
    isError: boolean;
    onAddMember: (role: AssignableBusinessRole) => void;
};

const MembersTable = ({ members, isLoading, isError, onAddMember }: MembersTableProps) => {
    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Team</h3>

                <div className="business-dashboard-table-controls">
                    <button
                        type="button"
                        className="business-dashboard-button-secondary"
                        onClick={() => onAddMember("Admin")}
                    >
                        Add admin
                    </button>

                    <button
                        type="button"
                        className="business-dashboard-button-primary"
                        onClick={() => onAddMember("Member")}
                    >
                        Add member
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Failed to load team members. Please try again.
                </p>
            ) : !members || members.length === 0 ? (
                <p className="business-dashboard-table-message">No team members yet.</p>
            ) : (
                <div className="business-dashboard-table-wrapper">
                    <table className="business-dashboard-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                            </tr>
                        </thead>

                        <tbody>
                            {members.map((member) => (
                                <tr key={member.userId}>
                                    <td>
                                        {member.firstName} {member.lastName}
                                    </td>
                                    <td>{member.email}</td>
                                    <td>
                                        <span
                                            className={`business-dashboard-badge business-dashboard-badge--${member.role.toLowerCase()}`}
                                        >
                                            {member.role}
                                        </span>
                                    </td>
                                    <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default MembersTable;
