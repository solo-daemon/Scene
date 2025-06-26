import chillScene from "@/app/assets/scene-aseets/chill_scene_image.webp";
import eatScene from "@/app/assets/scene-aseets/eat_scene_image.webp";
import travelScene from "@/app/assets/scene-aseets/travel_scene_image.webp";
import partyScene from "@/app/assets/scene-aseets/party_scene_image.webp";

export const userSceneImage = (scene_type: string) => {
    switch (scene_type) {
        case "chill":
            return chillScene;
            break;
        case "eat":
            return eatScene;
            break;
        case "travel":
            return travelScene;
        case "party":
            return partyScene;
            break;
        default:
            return chillScene;
    }
}
