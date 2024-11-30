import { FaPlus, FaMinus } from 'react-icons/fa';  // React Icons থেকে প্লাস এবং মাইনাস আইকন ইমপোর্ট করুন
import { toast } from 'react-toastify';  // Toastify ইমপোর্ট করুন
import 'react-toastify/dist/ReactToastify.css';  // Toastify CSS স্টাইল ইমপোর্ট করুন

const ProductQuantityControl = ({ qty, setQty, product }) => {
  const handleAddQuantity = () => {
    if (qty < product.countInStock) {
      setQty(qty + 1);
    } else {
      toast.error("স্টক শেষ, প্লাস বাটনে ক্লিক করা যাবে না!"); 
    }
  };

  return (
    <div className="flex items-center gap-2">
      <table className="table-auto border-separate border-spacing-2 border border-gray-300 w-[10rem]">
        <tbody>
          <tr>
            <td className="text-center">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={qty <= 1}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
              >
                <FaMinus size={16} /> {/* Minus Icon */}
              </button>
            </td>
            <td className="text-center">
              <span className="text-lg font-semibold">{qty}</span> {/* Displaying the current quantity */}
            </td>
            <td className="text-center">
              <button
                onClick={handleAddQuantity}  // Plus button click handler
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <FaPlus size={16} /> {/* Plus Icon */}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export const notify = () => toast("অভিনন্দন! আপনি সফলভাবে পণ্যটি যোগ করেছেন!");

export default ProductQuantityControl;
