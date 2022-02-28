export interface Image {
  /**
   * The public url used to fetch the image.
   */
  imageUrl: string;

  /**
   * The filename of the image.
   */
  filename: string;

  /**
   * Indicates if the image is a default image. Default images cannot be deleted.
   */
  isDefault?: boolean;

}
