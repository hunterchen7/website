import { Title } from "@solidjs/meta";
import { manifest } from "~/constants/photos";
import { Gallery as GalleryComponent } from "~/components/Gallery";

export default function Gallery() {
  return (
    <>
      <Title>Gallery</Title>
      <GalleryComponent
        manifest={manifest}
        caption="a collection of some photos I took that I like :)"
        seed={587}
      />
    </>
  );
}
