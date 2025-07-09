import PropTypes from "prop-types";

export default function SuggestionsSidebar({ suggestions = [] }) {
  if (!suggestions.length) return null;           // Don’t render an empty card

  return (
    <aside className="bg-white rounded-2xl shadow p-6 border border-[#009ddb]/10">
      <h3 className="text-md font-bold text-[#009ddb] mb-4">Who to Follow</h3>

      <ul className="space-y-3">
        {suggestions.map(({ id, name, handle }) => (
          <li
            key={id}
            className="flex justify-between items-center text-sm hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div>
              <p className="font-semibold text-gray-800">{name}</p>
              <p className="text-gray-500">{handle}</p>
            </div>

            <button
              type="button"
              className="bg-[#009ddb] hover:bg-[#fb5c1d] text-white font-bold py-1 px-4 rounded-full transition-colors"
            >
              Follow
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

SuggestionsSidebar.propTypes = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      id:     PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name:   PropTypes.string.isRequired,
      handle: PropTypes.string.isRequired,
    })
  ),
};



