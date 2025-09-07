
import React, { useState } from 'react';
import { TimelineTask } from '../../types';

interface ProjectTimelineProps {
  tasks: TimelineTask[];
  onUpdate: (tasks: TimelineTask[]) => void;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ tasks, onUpdate }) => {
  const [newTask, setNewTask] = useState({ name: '', start: '', end: '' });

  const handleAddTask = () => {
    if (!newTask.name || !newTask.start || !newTask.end) return;
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const taskToAdd: TimelineTask = { id: newId, ...newTask, progress: 0 };
    onUpdate([...tasks, taskToAdd]);
    setNewTask({ name: '', start: '', end: '' });
  };
  
  const getDaysDiff = (start: string, end: string) => (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24) + 1;
  
  const minDate = tasks.length > 0 ? tasks.reduce((min, p) => p.start < min ? p.start : min, tasks[0].start) : new Date().toISOString().split('T')[0];
  const maxDate = tasks.length > 0 ? tasks.reduce((max, p) => p.end > max ? p.end : max, tasks[0].end) : new Date().toISOString().split('T')[0];
  
  const totalDays = getDaysDiff(minDate, maxDate);
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Project Timeline (Gantt Chart)</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 border-b pb-6">
          <input type="text" placeholder="Task Name" value={newTask.name} onChange={e => setNewTask({...newTask, name: e.target.value})} className="p-2 border rounded" />
          <input type="date" placeholder="Start Date" value={newTask.start} onChange={e => setNewTask({...newTask, start: e.target.value})} className="p-2 border rounded" />
          <input type="date" placeholder="End Date" value={newTask.end} onChange={e => setNewTask({...newTask, end: e.target.value})} className="p-2 border rounded" />
          <button onClick={handleAddTask} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-700">Add Task</button>
        </div>

        <div className="space-y-4">
          {tasks.map(task => {
            const offsetDays = getDaysDiff(minDate, task.start) -1;
            const durationDays = getDaysDiff(task.start, task.end);
            const offsetPercent = (offsetDays / totalDays) * 100;
            const durationPercent = (durationDays / totalDays) * 100;
            
            return (
              <div key={task.id} className="grid grid-cols-4 gap-4 items-center">
                <div className="col-span-1 truncate font-medium">{task.name}</div>
                <div className="col-span-3 h-8 bg-slate-200 rounded-full relative">
                  <div 
                    style={{ left: `${offsetPercent}%`, width: `${durationPercent}%` }} 
                    className="absolute top-0 h-8 bg-blue-400 rounded-full"
                  >
                     <div 
                        style={{ width: `${task.progress}%` }}
                        className="h-full bg-blue-600 rounded-full"
                     ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;
