const EditModal = ({
  editData,
  setEditData,
  setIsEditModalOpen,
  handleSaveEdit,
}: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="background-light800_dark400 text-dark100_light500 p-5 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit User Info</h2>
        <label className="block mb-2">
          Full Name:
          <input
            type="text"
            value={editData.fullName}
            onChange={(e) =>
              setEditData({ ...editData, fullName: e.target.value })
            }
            className="w-full bg-transparent p-2 border border-gray-300 rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Phone Number:
          <input
            type="text"
            value={editData.phoneNumber}
            onChange={(e) =>
              setEditData({ ...editData, phoneNumber: e.target.value })
            }
            className="w-full p-2 bg-transparent border border-gray-300 rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Email:
          <input
            type="email"
            value={editData.email}
            onChange={(e) =>
              setEditData({ ...editData, email: e.target.value })
            }
            className="w-full p-2 bg-transparent border border-gray-300 rounded mt-1"
          />
        </label>
        <label className="block mb-2">
          Address:
          <input
            type="text"
            value={editData.address}
            onChange={(e) =>
              setEditData({ ...editData, address: e.target.value })
            }
            className="w-full p-2 bg-transparent border border-gray-300 rounded mt-1"
          />
        </label>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="bg-gray-300 dark:bg-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            className="bg-primary-100 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;