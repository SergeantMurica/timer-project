import {useState} from "react";

interface TimeEntry {
    id: number;
    task: string;
    duration: number;
    date: string;
}

const TimeTracker = () => {
    const [task, setTask] = useState<string>("");
    const [time, setTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
    const [timerId, setTimerId] = useState<number | null>(null);

    // Handle Start/Stop Timer
    const handleTimer = () => {
        if (!isRunning) {
            // Start Timer
            setIsRunning(true);
            const startTime = Date.now() - time * 1000; // Maintain current time
            const intervalId = setInterval(() => {
                setTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
            setTimerId(intervalId);
        } else {
            // Stop Timer
            if (timerId !== null) {
                clearInterval(timerId);
                setTimerId(null);
            }
            setIsRunning(false);
        }
    };

    // Handle Save Time Entry
    const saveTimeEntry = () => {
        if (task.trim() === "") {
            alert("Please enter a task name before saving!");
            return;
        }
        setTimeEntries((prevEntries) => [
            ...prevEntries,
            {
                id: prevEntries.length + 1,
                task,
                duration: time,
                date: new Date().toLocaleString(),
            },
        ]);
        setTask("");
        setTime(0);
        setIsRunning(false);
        if (timerId) clearInterval(timerId);
    };

    // Format Duration
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins} min ${secs} sec`;
    };

    return (
        <div className="time-tracking-page p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Time Tracker
            </h1>

            {/* Timer Input and Controls */}
            <div className="flex gap-4 mb-6 items-center">
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Enter Task Name"
                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-md w-1/3 text-gray-800 dark:text-gray-200"
                />
                <button
                    onClick={handleTimer}
                    className={`px-4 py-2 rounded-md font-medium ${
                        isRunning
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                >
                    {isRunning ? "Stop" : "Start"}
                </button>
                <button
                    onClick={saveTimeEntry}
                    disabled={isRunning || time === 0}
                    className={`px-4 py-2 rounded-md font-medium ${
                        time > 0
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-400 text-gray-700 cursor-not-allowed"
                    }`}
                >
                    Save
                </button>
            </div>

            {/* Timer Display */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Current Task: {task || "N/A"}
                </h2>
                <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    Time: {formatDuration(time)}
                </h2>
            </div>

            {/* Previous Time Entries */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Time Entries
                </h2>
                {timeEntries.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">
                        No time entries yet. Start tracking!
                    </p>
                ) : (
                    <table
                        className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                        <thead>
                        <tr className="bg-gray-200 dark:bg-gray-800">
                            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                Task
                            </th>
                            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                Duration
                            </th>
                            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                Date
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {timeEntries.map((entry) => (
                            <tr
                                key={entry.id}
                                className="text-center odd:bg-gray-100 even:bg-white dark:odd:bg-gray-800 dark:even:bg-gray-700"
                            >
                                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                    {entry.task}
                                </td>
                                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                    {formatDuration(entry.duration)}
                                </td>
                                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                                    {entry.date}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TimeTracker;
