import { useState, useEffect, useRef } from "react"
import { useRive, useStateMachineInput } from "@rive-app/react-canvas"
import Typed from "react-typed"

const buttonData = [
  {
    id: 1,
    label: "Apple",
    description:
      "Apples are one of the most popular fruits in the world. They come in various colors and flavors and are known for their crisp texture and sweet or tart taste. Apples are often used in a wide range of culinary dishes, including pies, salads, and juices.",
  },
  {
    id: 2,
    label: "Carrot",
    description:
      "Carrots are root vegetables that are commonly orange but can also be found in other colors like purple and yellow. They are a good source of vitamins and minerals, especially vitamin A. Carrots are often used in salads, soups, and as a popular snack.",
  },
  {
    id: 3,
    label: "Sunflower",
    description:
      "Sunflowers are tall, flowering plants known for their large, vibrant yellow blooms. They are native to North America and are often associated with positivity and sunny days. Sunflower seeds are a popular snack and can be used in various culinary applications.",
  },
  {
    id: 4,
    label: "Mountain",
    description:
      "Mountains are large landforms that rise prominently above the surrounding terrain. They are characterized by their towering peaks, rugged landscapes, and often, snow-covered summits. Mountains play a vital role in Earth's ecosystems and are popular destinations for hikers and climbers.",
  },
  {
    id: 5,
    label: "Ocean",
    description:
      "The ocean covers over 70% of Earth's surface and is home to a diverse range of marine life. It plays a crucial role in regulating the planet's climate and is a source of livelihood for many coastal communities. The ocean offers endless opportunities for exploration and recreation.",
  },
  {
    id: 6,
    label: "Book",
    description:
      "Books are written or printed works that contain information, stories, or knowledge. They come in various genres and formats, including novels, textbooks, and e-books. Books have been a fundamental medium for preserving and sharing knowledge throughout human history.",
  },
]

// const explainData = [
//   {
//     id: 1,
//     label: "Not Connected to a backend yet.",
//     description:
//       "I'm yet to connect the chrome extension to the backend API. The Pages for were the user can view the recorded video has been done. But it's yet to be connected to the API. ごめんなさい",
//   },
//   {
//     id: 2,
//     label: "Audio not working.",
//     description:
//       "The recorded audio is not coming through yet. Hence why I'm using this to explain myself. Although recorded audio from the system does come through. But I still need to look into that.  ごめんなさい",
//   },
//   {
//     id: 3,
//     label: "Controls on Popup not working",
//     description:
//       "The Video and Audio switch on the popup are just dummies for now. The Settings icon is also a dummy. But the Other buttons work as intended. ごめんなさい",
//   },
//   {
//     id: 4,
//     label: "Current Tab Recording",
//     description:
//       "For now I'm able to get the current tab recording to work without requesting permission. But I'm yet to add the video controls while recording. ごめんなさい",
//   },
// ]

function App() {
  const Assistant = useRive({
    src: "/assistant.riv",
    autoplay: true,
    stateMachines: "Login Machine",
  })

  const isShowingTip = useStateMachineInput(
    Assistant.rive,
    "Login Machine",
    "trigSuccess"
  )

  const LightBulb = useRive({
    src: "/lightbulb.riv",
    autoplay: true,
  })

  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  let defaultPosition = useRef({ x: 8, y: windowHeight - 138 })

  const [showTip, setShowTip] = useState(false)
  const [currentTip, setCurrentTip] = useState(null)

  const [position, setPosition] = useState(defaultPosition.current)

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
      defaultPosition.current = { x: 8, y: window.innerHeight - 138 }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleOnClick = (event, data) => {
    setShowTip(false)
    setCurrentTip(null)
    Assistant.rive.play("Hands_up")
    LightBulb.rive.play("of")

    setTimeout(() => {
      const x = event.clientX
      const y = event.clientY

      setPosition({ x, y })

      setTimeout(() => {
        Assistant.rive.play("hands_down")
        LightBulb.rive.play("on")
        setCurrentTip(data)
      }, 500)
    }, 500)
  }

  const handleOnLightbulbClick = () => {
    setShowTip(true)
    isShowingTip.fire()

    setTimeout(() => {
      Assistant.rive.play("Look_down_right")
      // Assistant.rive.play("Look_down_left")
    }, 10000)
  }

  return (
    <div className="w-full h-screen bg-gray-800">
      {/* <h1 className="text-white text-5xl font-bold p-4">
        Explaining why my Extension is not working as it should.
      </h1> */}
      <div className="flex gap-14 flex-wrap max-w-5xl mx-auto p-4">
        {buttonData.map((item) => (
          <button
            onClick={(e) => handleOnClick(e, item)}
            key={item.id}
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        style={{
          left: position.x,
          top: position.y,
          transition: "top 500ms ease-in-out, left 500ms ease-in-out",
        }}
        className="w-40 h-40  fixed"
      >
        {showTip && (
          <div
            style={{
              scale: showTip ? 1 : 0,
              transition: "scale 300ms ease-in-out",
            }}
            className="absolute top-32 w-60 bg-[#CDDCE5] rounded p-4 flex flex-col gap-2"
          >
            <Typed
              strings={[currentTip ? currentTip.label : ""]}
              typeSpeed={40}
            />
            {/* <p className="font-semibold text-base">{currentTip?.label}</p> */}

            <Typed
              strings={[currentTip ? currentTip.description : ""]}
              typeSpeed={60}
              className="text-sm"
            />

            {/* <p className="text-xs font-medium font-sans">
              {currentTip?.description}
            </p> */}
          </div>
        )}

        <button
          onClick={handleOnLightbulbClick}
          className="w-14 h-14 object-contain absolute top-[-16px] left-[10%] z-10"
        >
          <LightBulb.RiveComponent />
        </button>

        <div className="w-40 h-40 z-20">
          <Assistant.RiveComponent />
        </div>
      </div>
    </div>
  )
}

export default App
