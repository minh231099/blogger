import { Post, User } from "@prisma/client";
import ViewIcon from '~/assets/image/view.png';

export type TopUser = Omit<User, 'password'> & {
    posts: Post[];
}

export interface TopUsersTableProps {
    users: TopUser[];
}

const countAllViewsOfUser = (posts: Post[]) => {
    const sumWithInitial = posts.reduce(
        (accumulator: number, currentValue: Post) => accumulator + currentValue.viewed,
        0,
    );
    return sumWithInitial;
}

const TopUsersTable = ({ users }: TopUsersTableProps) => {
    return (
        <div className="border rounded-sm px-4 pb-2">
            <p className="py-4">Outstanding Pen</p>
            {users.map(user => (
                <div key={user.id} className="flex align-center items-center justify-between pb-2">
                    <div>
                        <b>{user.name}</b>
                        <p className="flex items-center"><img className='w-5 h-5 mr-2' src={ViewIcon} /> {countAllViewsOfUser(user.posts)}</p>
                    </div>
                    <div>
                        <button className="border rounded-full py-1 px-4 text-sm">View</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TopUsersTable;
