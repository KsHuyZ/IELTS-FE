import { BsFillPatchCheckFill } from "react-icons/bs";

interface StepProps {
  step: number; // Bước hiện tại (1, 2, hoặc 3)
}

const StepEdit = ({ step }: StepProps) => {
  // Danh sách các bước
  const steps = [
    { id: 1, title: "Edit Basic Exam" },
    { id: 2, title: "Edit Exam Detail" },
  ];

  return (
    <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
      {steps.map((item, index) => (
        <li
          key={item.id}
          className={`flex ${
            index !== steps.length - 1 ? "md:w-full" : ""
          } items-center ${
            item.id <= step ? "text-blue-600 dark:text-blue-500" : ""
          } ${
            index !== steps.length - 1
              ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-2 xl:after:mx-4 dark:after:border-gray-700"
              : ""
          }`}
        >
          <span
            className={`flex items-center gap-4 whitespace-nowrap ${
              index !== steps.length - 1
                ? "after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500"
                : ""
            }`}
          >
            {item.id <= step ? (
              <BsFillPatchCheckFill className="size-10" />
            ) : (
              <span className="me-2">{item.id}</span>
            )}
            <span
              className={`${
                item.id === 2 ? "hidden sm:inline-flex sm:ms-2" : ""
              } whitespace-nowrap`}
            >
              {item.title}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
};

export default StepEdit;
