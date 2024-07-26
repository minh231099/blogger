import { ActionFunction, json, redirect } from '@remix-run/node';
import { Link, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import WrittingIcon from '~/assets/image/quill-pen.png';
import SearchIcon from '~/assets/image/search-icon.png';

interface HeaderProps {
  user?: { name: string };
}

function Header(props: HeaderProps) {
  const { user } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`/?search=${searchQuery}`);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav
      className="flex items-center justify-between flex-wrap bg-white py-4 lg:px-12 shadow border-solid border-t-2 border-blue-700">
      <div className="flex justify-between lg:w-auto w-full lg:border-b-0 pl-6 pr-2 border-solid border-b-2 border-gray-300 pb-5 lg:pb-0">
        <div className="flex items-center flex-shrink-0 text-gray-800 mr-16">
          <Link to="/"><span className="font-semibold text-xl">My Blog</span></Link>
        </div>
        <div className="block lg:hidden">
          <button
            id="nav"
            className="flex items-center px-3 py-2 border-2 rounded"
            onClick={() => (setShowMenu(!showMenu))}
          >
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`menu ${!showMenu ? 'hidden' : ''} w-full lg:block flex-grow lg:flex lg:items-center lg:w-auto lg:px-3 px-8`}>
        <div className="text-md font-bold lg:flex-grow">
          {
            user && user.name ?
              <a href="#responsive-header"
                className="block mt-4 lg:inline-block lg:mt-0 px-4 py-2 rounded mr-2">
                <Link to="/new-post" className="hover:underline flex">
                  <img
                    className="w-5 h-5 mr-1"
                    src={WrittingIcon}
                    alt="New Writing"
                  />
                  New Writing
                </Link>
              </a>
              : null
          }
        </div>
        <div className="relative mx-auto text-gray-600 lg:block hidden">
          <form onSubmit={handleSearch}>
            <input
              className="border-2 border-gray-300 bg-white h-10 pl-2 pr-8 rounded-lg text-sm focus:outline-none"
              type="search" name="search" placeholder="Search"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-0 top-0 mt-3 mr-2">
              <img src={SearchIcon} alt="Search" className="w-4 h-4" />
            </button>
          </form>
        </div>
        {
          user && user.name ?
            <div className="relative ml-2">
              <button onClick={toggleDropdown} className="hidden lg:block hover:underline flex items-center">
                {user.name}
              </button>
              <Link to="/profile" className="block lg:hidden px-4 py-2 text-gray-700 hover:bg-gray-100">{user.name}</Link>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Your Articles</Link>
                  <Link to="/logout" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</Link>
                </div>
              )}
            </div>
            :
            <div className="flex lg:flex-row flex-col">
              <Link to="/signin" className="block text-md px-4 py-2 rounded ml-2 font-bold mt-4 lg:mt-0">Sign In</Link>
              <Link to="/signup" className="block text-md px-4  ml-2 py-2 rounded font-bold mt-4 lg:mt-0">Sign Up</Link>
            </div>
        }
      </div>

    </nav>
  );
}

export default Header;
